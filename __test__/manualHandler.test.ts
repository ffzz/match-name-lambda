import { NAME_LIST } from '@/constant/nameList';
import {
  matchChineseName,
  matchEnglishName,
  matchMixedInputName,
  matchNameCharater,
} from '@/handlers/manualHandler';

describe('matchChineseName Function', () => {
  it('should return the best match and ratio for a perfect match', () => {
    const inputName = '月林张';

    const result = matchChineseName(inputName, NAME_LIST);

    expect(result.bestMatch).toEqual(['Yueling Zhang 月林张']);
    expect(result.bestRatio).toBe(1);
  });

  it('should return the best match and ratio for a partial match', () => {
    const inputName = '安妮';

    const result = matchChineseName(inputName, NAME_LIST);

    expect(result.bestMatch).toEqual(['Annie Lee 李安妮']);
    expect(result.bestRatio).toBeGreaterThan(0.5);
    expect(result.bestRatio).toBeLessThan(1);
  });

  it('should return no match if input name does not match any preset name', () => {
    const inputName = '赵小红';

    const result = matchChineseName(inputName, NAME_LIST);

    expect(result.bestMatch).toEqual([]);
    expect(result.bestRatio).toBe(0);
  });
});

describe('matchEnglishName Function', () => {
  it('should return the best match and ratio for a perfect match', () => {
    const inputName = 'Benjamin Lee';

    const result = matchEnglishName(inputName, NAME_LIST);

    expect(result.bestMatch).toEqual(['Benjamin Lee 本雅明李']);
    expect(result.bestRatio).toBe(1);
  });

  it('should return the best match and ratio for a partial match', () => {
    const inputName = 'Lee';

    const result = matchEnglishName(inputName, NAME_LIST);

    expect(result.bestMatch).toEqual([
      'Annie Lee 李安妮',
      'John Lee 约翰李',
      'Benjamin Lee 本雅明李',
    ]);
    expect(result.bestRatio).toEqual(0.5);
    expect(result.bestRatio).toBeLessThan(1);
  });

  it('should return no match if input name does not match any preset name', () => {
    const inputName = 'hello';

    const result = matchEnglishName(inputName, NAME_LIST);

    expect(result.bestMatch).toEqual([]);
    expect(result.bestRatio).toBe(0);
  });
});

describe('matchMixedInputName', () => {
  it('should return an object with bestMatch and bestRatio', () => {
    const inputName = 'David 大卫';
    const presetNameList = ['David Jones 大卫 琼斯'];
    const result = matchMixedInputName(inputName, presetNameList);
    expect(result).toHaveProperty('bestMatch');
    expect(result).toHaveProperty('bestRatio');
  });

  it('should return the correct bestMatch and bestRatio when the input name matches a preset name', () => {
    const inputName = 'David Jones 大卫 琼斯';
    const presetNameList = ['David Jones 大卫 琼斯'];
    const result = matchMixedInputName(inputName, presetNameList);
    expect(result.bestMatch).toEqual(presetNameList);
    expect(result.bestRatio).toBe(1);
  });

  it('should return the correct bestMatch and bestRatio when the input name matches a preset name partially', () => {
    const inputName = 'David 大卫';
    const presetNameList = ['David Jones 大卫 琼斯'];
    const result = matchMixedInputName(inputName, presetNameList);
    expect(result.bestMatch).toEqual(['David Jones 大卫 琼斯']);
    expect(result.bestRatio).toBeCloseTo(0.5);
  });

  it('should return the correct bestMatch and bestRatio when the input name does not match any preset name', () => {
    const inputName = 'David 大卫';
    const presetNameList = ['Annie Lee 李安妮', 'John Lee 约翰李'];
    const result = matchMixedInputName(inputName, presetNameList);
    expect(result.bestMatch).toEqual([]);
    expect(result.bestRatio).toBe(0);
  });
});

import { matchNameManually } from '@/handlers/manualHandler';

describe('matchNameManually Function', () => {
  it('should return a perfect match for Chinese names', () => {
    const inputName = '月林张';
    const presetNameList = ['Yueling Zhang 月林张'];
    const result = matchNameManually(inputName, presetNameList);
    expect(result.bestMatchName).toEqual('Yueling Zhang 月林张');
    expect(result.message).toBe('Match found, perfect match!');
  });

  it('should return a partial match for Chinese names', () => {
    const inputName = '安妮';
    const presetNameList = ['Annie Lee 李安妮'];
    const result = matchNameManually(inputName, presetNameList);
    expect(result.bestMatchName).toEqual('Annie Lee 李安妮');
    expect(result.message).toBe('Match found, partial match!');
  });

  it('should return a perfect match for English names', () => {
    const inputName = 'Benjamin Lee';
    const presetNameList = ['Benjamin Lee 本雅明 李'];
    const result = matchNameManually(inputName, presetNameList);
    expect(result.bestMatchName).toEqual('Benjamin Lee 本雅明 李');
    expect(result.message).toBe('Match found, perfect match!');
  });

  it('should return a partial match for English names', () => {
    const inputName = 'Benjamin';
    const presetNameList = ['Benjamin Lee 本雅明 李'];
    const result = matchNameManually(inputName, presetNameList);
    expect(result.bestMatchName).toEqual('Benjamin Lee 本雅明 李');
    expect(result.message).toBe('Match found, partial match!');
  });

  it('should return a poor match for mixed names', () => {
    const inputName = 'Benjamin 方正';
    const presetNameList = ['Benjamin Lee 本雅明 李'];
    const result = matchNameManually(inputName, presetNameList);
    expect(result.bestMatchName).toEqual('Benjamin Lee 本雅明 李');
    expect(result.message).toBe('Match found, poor match!');
  });

  it('should return a multiple partial match for English names', () => {
    const inputName = 'lee';
    const presetNameList = ['Annie Lee 李安妮', 'John Lee 约翰李', 'Benjamin Lee 本雅明李'];
    const result = matchNameManually(inputName, presetNameList);
    expect(result.bestMatchName).toEqual(
      'Annie Lee 李安妮, John Lee 约翰李, Benjamin Lee 本雅明李',
    );
    expect(result.message).toBe('Match found, partial match!');
  });

  it('should return a multiple partial match for multiple mixed names', () => {
    const inputName = 'lee 李';
    const presetNameList = ['Annie Lee 李安妮', 'John Lee 约翰李', 'Benjamin Lee 本雅明李'];

    const result = matchNameManually(inputName, presetNameList);

    expect(result.bestMatchName).toEqual('Annie Lee 李安妮, John Lee 约翰李');
    expect(result.message).toBe('Match found, poor match!');
  });

  it('should return a multiple poor match for Chinese names', () => {
    const inputName = '李';
    const presetNameList = ['Annie Lee 李安妮', 'John Lee 约翰李', 'Benjamin Lee 本雅明李'];
    const result = matchNameManually(inputName, presetNameList);
    expect(result.bestMatchName).toEqual('Annie Lee 李安妮, John Lee 约翰李');
    expect(result.message).toBe('Match found, poor match!');
  });

  it('should return no match for a mix of Chinese and English names', () => {
    const inputName = 'David 大卫';
    const presetNameList = ['Annie Lee 李安妮', 'John Lee 约翰李'];
    const result = matchNameManually(inputName, presetNameList);
    expect(result.bestMatchName).toEqual('');
    expect(result.message).toBe('No match found.');
  });

  it('should return the best match and ratio for a partial match', () => {
    const inputName = '吴';

    const result = matchChineseName(inputName, NAME_LIST);

    expect(result.bestMatch).toEqual(['Huawen Wu 华文吴']);
    expect(result.bestRatio).toBeGreaterThan(0);
    expect(result.bestRatio).toBeLessThan(0.5);
  });

  it('should return the best match and ratio for a poor match', () => {
    const inputName = '吴华';

    const result = matchChineseName(inputName, NAME_LIST);

    expect(result.bestMatch).toEqual(['Huawen Wu 华文吴']);
    expect(result.bestRatio).toBeGreaterThan(0);
    expect(result.bestRatio).toBeLessThan(0.5);
  });
});

describe('matchNameCharater', () => {
  it('should return correct ratio when inputString matches characters in presetString', () => {
    const inputString = '华文吴';
    const presetString = '华文吴';
    expect(matchNameCharater(inputString, presetString)).toBeCloseTo(0.7);
  });

  it('should return correct ratio when inputString partially matches characters in presetString', () => {
    const inputString = '吴华';
    const presetString = '华文吴';
    expect(matchNameCharater(inputString, presetString)).toBeCloseTo(0.3667, 1);
  });

  it('should return 0 when no characters in inputString match presetString', () => {
    const inputString = 'abc';
    const presetString = '华文吴';
    expect(matchNameCharater(inputString, presetString)).toBe(0);
  });

  it('should return correct ratio when inputString contains characters not in presetString', () => {
    const inputString = '吴abc';
    const presetString = '华文吴';
    expect(matchNameCharater(inputString, presetString)).toBeCloseTo(0.33333, 1);
  });

  it('should not reduce ratio by 0.3 if the initial ratio is less than 0.5', () => {
    const inputString = '吴';
    const presetString = '华文吴';
    expect(matchNameCharater(inputString, presetString)).toBeCloseTo(0.3333, 1);
  });

  it('should handle empty inputString', () => {
    const inputString = '';
    const presetString = '华文吴';
    expect(matchNameCharater(inputString, presetString)).toBe(0);
  });
});
