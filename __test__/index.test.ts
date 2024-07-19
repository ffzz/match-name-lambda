import {
  APIGatewayEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda';
import { handler } from '../index';
// import CustomError from '@/customError/CustomErrorClass';
import { matchNameViaAi } from '@/handlers/aiHandler';
import { NAME_LIST } from '@/constant/nameList';
import { matchNameManually } from '@/handlers/manualHandler';

// Mock dependencies
jest.mock('@/handlers/aiHandler');
jest.mock('@/handlers/manualHandler');

const mockMatchNameViaAi = matchNameViaAi as jest.Mock;
const mockMatchNameManually = matchNameManually as jest.Mock;

describe('handler', () => {
  const createAPIGatewayEvent = (
    queryStringParameters: APIGatewayProxyEventQueryStringParameters | null,
  ): APIGatewayEvent => ({
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/',
    pathParameters: null,
    queryStringParameters,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayEventRequestContext,
    resource: '',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 for empty parameters', async () => {
    const event = createAPIGatewayEvent(null);

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      data: {
        input: '',
        bestMatchName: '',
        message: 'Invalid input name, The input name must be a string and cannot be empty.',
      },
    });
  });

  test('should return 400 for empty name', async () => {
    const event = createAPIGatewayEvent({ name: '' });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      data: {
        input: '',
        bestMatchName: '',
        message: 'Invalid input name, The input name must be a string and cannot be empty.',
      },
    });
  });

  test('should return 400 for invalid name', async () => {
    const event = createAPIGatewayEvent({ name: 'hello21432' });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      data: {
        input: 'hello21432',
        bestMatchName: '',
        message:
          'Invalid input name. The input name can only consist of Chinese and English characters, along with spaces; numbers, symbols, or other characters are not allowed.',
      },
    });
  });

  test('should call matchNameViaAi and return result when ai is true', async () => {
    const event = createAPIGatewayEvent({ name: 'TestName', ai: 'true' });
    const mockResult = { bestMatchName: 'MockedName' };
    mockMatchNameViaAi.mockResolvedValue(mockResult);

    const result = await handler(event);

    expect(mockMatchNameViaAi).toHaveBeenCalledWith('TestName');
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      data: {
        input: 'TestName',
        bestMatchName: 'MockedName',
      },
    });
  });

  test('should call matchNameManually and return result when ai is false', async () => {
    const event = createAPIGatewayEvent({ name: 'TestName', ai: '' });
    const mockResult = { bestMatchName: 'ManualMatchedName' };
    mockMatchNameManually.mockReturnValue(mockResult);

    const result = await handler(event);

    expect(mockMatchNameManually).toHaveBeenCalledWith('TestName', NAME_LIST);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      data: {
        input: 'TestName',
        bestMatchName: 'ManualMatchedName',
      },
    });
  });

  test('should return 500 for unknown error', async () => {
    const event = createAPIGatewayEvent({ name: 'TestName' });
    mockMatchNameManually.mockImplementation(() => {
      throw new Error('Unknown error');
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      data: {
        input: 'TestName',
        bestMatchName: '',
        message: 'Unknown error',
      },
    });
  });
});
