import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import CustomError from '@/customError/CustomErrorClass';
import { matchNameViaAi } from '@/handlers/aiHandler';
import { NAME_LIST } from '@/constant/nameList';
import { isChineseOnly, isEnglishOnly, splitName } from '@/utils';
import { matchNameManually } from '@/handlers/manualHandler';

/**
 * Handler function that processes the API Gateway event  validates the input name,and returns the best match name,
 * matches the name either via AI or manually, and returns the result in a JSON format.
 *
 * @param {APIGatewayEvent} event - The API Gateway event object containing the request details.
 * @return {Promise<APIGatewayProxyResult>} A promise that resolves to an API Gateway proxy result.
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { name = '', ai = '' } = event.queryStringParameters || {};

    const trimmedName = name.trim();

    if (!trimmedName || typeof trimmedName !== 'string' || trimmedName.trim().length === 0) {
      // Invalid empty input name
      throw new CustomError(
        'Invalid input name, The input name must be a string and cannot be empty.',
        400,
      );
    }

    const splitedInputName = splitName(trimmedName);

    for (const name of splitedInputName) {
      if (!isChineseOnly(name) && !isEnglishOnly(name)) {
        // Invalid input name
        throw new CustomError(
          'Invalid input name. The input name can only consist of Chinese and English characters, along with spaces; numbers, symbols, or other characters are not allowed.',
          400,
        );
      }
    }

    let result = {};

    if (ai) {
      // AI match mode
      result = await matchNameViaAi(trimmedName);
    } else {
      // Manual match mode by codes
      result = matchNameManually(trimmedName, NAME_LIST);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          input: name,
          ...result,
        },
      }),
    };
  } catch (error: unknown) {
    let message = '';
    let code = 500;

    if (error instanceof CustomError) {
      message = error.message;
      code = error.code;
    } else {
      message = 'Unknown error';
    }

    return {
      statusCode: code,
      body: JSON.stringify({
        data: {
          input: event?.queryStringParameters?.name || '',
          bestMatchName: '',
          message,
        },
      }),
    };
  }
};
