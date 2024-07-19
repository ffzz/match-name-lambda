import { matchNameViaAi } from '@/handlers/aiHandler';
import { NameMatchResponse } from '@/types/reponseType';

describe('matchNameViaAi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the best match name and message when a match is found', async () => {
    const result = await matchNameViaAi('Yueling Zhang');

    expect(result).toEqual({
      bestMatchName: 'Yueling Zhang 月林张',
      message: 'Match found, perfect match!',
    });
  });

  it('should return no match found message when no match is found', async () => {
    const result = await matchNameViaAi('Nonexistent Name');

    const posibleMatchNames = [
      {
        bestMatchName: '',
        message: 'No match found.',
      },
      {
        bestMatchName: '',
        message:
          'Invalid input name. The input name can only consist of Chinese and English characters, along with spaces; numbers, symbols, or other characters are not allowed.',
      },
    ];

    expect(posibleMatchNames).toContainEqual<NameMatchResponse>(result);
  });

  it('should return an partial match when a match is found', async () => {
    const result = await matchNameViaAi('ben');

    expect(result.bestMatchName).toEqual('Benjamin Lee 本雅明李');
    expect(result).toHaveProperty('message');
  });

  it('should return multiple partial matchs when multiple matchs are found', async () => {
    const result = await matchNameViaAi('Lee');

    expect(result.bestMatchName).toEqual(
      'Annie Lee 李安妮, John Lee 约翰李, Benjamin Lee 本雅明李',
    );
    expect(result).toHaveProperty(
      'message',
      'Match found, Lee is a common surname and part of several names.',
    );
  });

  it('should return invalid input message when input contains invalid characters', async () => {
    const result = await matchNameViaAi('InvalidName123');

    expect(result).toEqual({
      bestMatchName: '',
      message:
        'Invalid input name. The input name can only consist of Chinese and English characters, along with spaces; numbers, symbols, or other characters are not allowed.',
    });
  });
});
