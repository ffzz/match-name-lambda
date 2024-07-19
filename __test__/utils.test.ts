import { isChineseOnly, isEnglishOnly, extractEnglish, extractChinese, splitName } from '@/utils';

describe('isChineseOnly Function', () => {
  it('should return true for a valid Chinese string', () => {
    const chineseString = '你好';
    const result = isChineseOnly(chineseString);
    expect(result).toBe(true);
  });

  it('should return true for a valid Chinese string with spaces', () => {
    const chineseString = '你 好';
    const result = isChineseOnly(chineseString);
    expect(result).toBe(true);
  });

  it('should return false for an string with only spaces', () => {
    const emptyString = ' ';
    const result = isChineseOnly(emptyString);
    expect(result).toBe(false);
  });

  it('should return false for an empty string', () => {
    const emptyString = '';
    const result = isChineseOnly(emptyString);
    expect(result).toBe(false);
  });

  it('should return false for a non-Chinese string', () => {
    const nonChineseString = 'Hello';
    const result = isChineseOnly(nonChineseString);
    expect(result).toBe(false);
  });

  it('should return true for a string with mixed Chinese and English characters', () => {
    const mixedString = 'hello 你好';
    const result = isChineseOnly(mixedString);
    expect(result).toBe(false);
  });
});

describe('isEnglishOnly Function', () => {
  it('should return true for a valid English string', () => {
    const englishString = 'HelloWorld';
    const result = isEnglishOnly(englishString);
    expect(result).toBe(true);
  });

  it('should return true for a valid English string with spaces', () => {
    const englishString = 'Hello World';
    const result = isEnglishOnly(englishString);
    expect(result).toBe(true);
  });

  it('should return false for an string with only spaces', () => {
    const emptyString = ' ';
    const result = isEnglishOnly(emptyString);
    expect(result).toBe(false);
  });

  it('should return false for an empty string', () => {
    const emptyString = '';
    const result = isEnglishOnly(emptyString);
    expect(result).toBe(false);
  });

  it('should return false for a non-English string', () => {
    const nonEnglishString = '你好';
    const result = isEnglishOnly(nonEnglishString);
    expect(result).toBe(false);
  });

  it('should return false for a string with mixed English and Chinese characters', () => {
    const mixedString = '你好 Hello';
    const result = isEnglishOnly(mixedString);
    expect(result).toBe(false);
  });
});

describe('extractEnglish', () => {
  it('should return an empty string when input is empty', () => {
    expect(extractEnglish('')).toBe('');
  });

  it('should return an empty string when input contains no English characters', () => {
    expect(extractEnglish('1234567890')).toBe('');
    expect(extractEnglish('!@#$%^&*()')).toBe('');
    expect(extractEnglish('汉字')).toBe('');
  });

  it('should extract only English characters from mixed input', () => {
    expect(extractEnglish('Hello123')).toBe('Hello');
    expect(extractEnglish('Hello123World')).toBe('Hello World');
    expect(extractEnglish('Hello 123 World!')).toBe('Hello World');
    expect(extractEnglish('你好Hello世界World')).toBe('Hello World');
  });

  it('should handle input with only English characters', () => {
    expect(extractEnglish('Hello')).toBe('Hello');
    expect(extractEnglish('Hello World')).toBe('Hello World');
  });

  it('should handle input with multiple spaces', () => {
    expect(extractEnglish('   Hello   World   ')).toBe('Hello World');
  });

  it('should handle input with English characters and special characters', () => {
    expect(extractEnglish('Hello! @World#')).toBe('Hello World');
    expect(extractEnglish('$$$Hello%%%World&&&')).toBe('Hello World');
  });

  it('should return an empty string when input contains only spaces', () => {
    expect(extractEnglish('     ')).toBe('');
  });
});

describe('extractChinese', () => {
  it('should extract Chinese characters and spaces when input text contains only Chinese characters and spaces', () => {
    const inputText = '你好 世界';
    const expectedOutput = '你好世界';
    expect(extractChinese(inputText)).toEqual(expectedOutput);
  });

  it('should extract Chinese characters and spaces when input text contains Chinese characters, spaces, and other characters', () => {
    const inputText = '你好 123 世界 !@#';
    const expectedOutput = '你好世界';
    expect(extractChinese(inputText)).toEqual(expectedOutput);
  });

  it('should extract Chinese characters and spaces when input text contains Chinese characters, spaces, and English characters', () => {
    const inputText = '你好 世界 Hello World';
    const expectedOutput = '你好世界';
    expect(extractChinese(inputText)).toEqual(expectedOutput);
  });

  it('should return an empty string when input text is empty', () => {
    const inputText = '';
    const expectedOutput = '';
    expect(extractChinese(inputText)).toEqual(expectedOutput);
  });

  it('should return an empty string when input text is with only spaces', () => {
    const inputText = ' ';
    const expectedOutput = '';
    expect(extractChinese(inputText)).toEqual(expectedOutput);
  });
});

describe('splitName function', () => {
  test('Should split a single word name', () => {
    const name = 'John';
    const result = splitName(name);
    expect(result).toEqual(['john']);
  });

  test('Should split a name with multiple words separated by spaces', () => {
    const name = 'Alice Bob Charlie';
    const result = splitName(name);
    expect(result).toEqual(['alice', 'bob', 'charlie']);
  });

  test('Should handle multiple consecutive spaces in a name', () => {
    const name = 'David   Emily 大卫 艾米丽';
    const result = splitName(name);
    expect(result).toEqual(['david', 'emily', '大卫', '艾米丽']);
  });

  test('Should empty out empty strings in a name', () => {
    const name = '';
    const result = splitName(name);
    expect(result).toEqual([]);
  });

  test('Should return an empty array for a name with only spaces', () => {
    const name = ' ';
    const result = splitName(name);
    expect(result).toEqual([]);
  });
});
