/**
 * Checks if a given string contains only Chinese characters and spaces.
 *
 * @param {string} str - The string to be checked.
 * @return {boolean} Returns true if the string contains only Chinese characters and spaces, false otherwise.
 */
export const isChineseOnly = (str: string): boolean => {
  return /^[\u4e00-\u9fa5\s]+$/.test(str.trim());
};

/**
 * Checks if a given string contains only English characters and spaces.
 *
 * @param {string} str - The string to be checked.
 * @return {boolean} Returns true if the string contains only English characters and spaces, false otherwise.
 */
export const isEnglishOnly = (str: string): boolean => {
  return /^[A-Za-z\s]+$/.test(str.trim());
};

/**
 * Extracts and returns only the English characters and spaces from the input text.
 *
 * @param {string} text - The input text to extract English characters from.
 * @return {string} The extracted English characters and spaces as a single string.
 */
export const extractEnglish = (text: string): string => {
  // Regular expression to match English characters and spaces
  const englishRegex = /[A-Za-z]+/g;

  const matches = text.match(englishRegex);

  // If matches are found, join them into a single string separated by spaces
  // Otherwise, return an empty string
  return matches ? matches.filter((part) => part.trim().length > 0).join(' ') : '';
};

/**
 * Extracts and returns only the Chinese characters and spaces from the input text.
 *
 * @param {string} text - The input text to extract Chinese characters from.
 * @return {string} The extracted Chinese characters and spaces as a single string.
 */
export const extractChinese = (text: string): string => {
  // Regular expression to match Chinese characters and spaces
  const chineseRegex = /[\u4e00-\u9fa5]+/g;
  const matches = text.match(chineseRegex);
  return matches ? matches.filter((part) => part.trim().length > 0).join('') : '';
};

/**
 * Splits a name string into an array of substrings based on whitespace.
 *
 * @param {string} name - The name string to be split.
 * @return {string[]} An array of substrings, with empty strings filtered out.
 */
export const splitName = (name: string): string[] => {
  return name
    .toLowerCase()
    .split(/\s+/) // Split by whitespace
    .filter((part) => part.length > 0); // Filter out empty strings
};
