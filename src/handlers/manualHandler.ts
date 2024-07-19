// import { NAME_LIST } from '@/constant/nameList';
import { MatchResult, NameMatchResponse } from '@/types/reponseType';
import { extractChinese, extractEnglish, isChineseOnly, isEnglishOnly, splitName } from '@/utils';

/**
 * Matches the input Chinese name with preset names and returns the best match along with the matching ratio.
 *
 * @param {string} inputName - The input Chinese name to match.
 * @param {readonly string[]} presetNameList - The list of preset names to match against.
 * @return {{ bestMatch: string[], bestRatio: number }} An object containing the best matching name(s) and the matching ratio.
 */
export const matchChineseName = (
  inputName: string,
  presetNameList: readonly string[],
): MatchResult => {
  let bestRatio = 0;
  let bestMatch: string[] = [];

  presetNameList.forEach((presetName) => {
    const chinesePart = extractChinese(presetName);
    let ratio = 0;

    if (chinesePart.includes(inputName)) {
      ratio = inputName.length / chinesePart.length;
    }
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestMatch = [presetName];
    } else if (ratio !== 0 && ratio === bestRatio) {
      bestMatch.push(presetName);
    }
  });

  return {
    bestMatch,
    bestRatio,
  };
};

/**
 * Matches the input English name with a list of preset names and returns the best match along with the matching ratio.
 *
 * @param {string} inputName - The input English name to match.
 * @param {readonly string[]} presetNameList - The list of preset names to match against.
 * @return {{ bestMatch: string[], bestRatio: number }} An object containing the best matching name(s) and the matching ratio.
 */
export const matchEnglishName = (
  inputName: string,
  presetNameList: readonly string[],
): MatchResult => {
  let bestRatio = 0;
  let bestMatch: string[] = [];

  presetNameList.forEach((presetName) => {
    const englishPart = splitName(extractEnglish(presetName));
    const inputEnglishPart = splitName(extractEnglish(inputName));

    let ratio = 0;
    let matchParts = 0;

    inputEnglishPart.forEach((name) => {
      if (englishPart.includes(name)) {
        matchParts++;
      }
    });

    ratio = matchParts / englishPart.length;

    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestMatch = [presetName];
    } else if (ratio !== 0 && ratio === bestRatio) {
      bestMatch.push(presetName);
    }
  });

  return {
    bestMatch,
    bestRatio,
  };
};

/**
 * Matches the mixed input name with preset names and returns the best match along with the matching ratio.
 *
 * @param {string} inputName - The mixed input name to match. like "David 大卫"
 * @param {readonly string[]} presetNameList - The list of preset names to match against.
 * @return {{ bestMatch: string[], bestRatio: number }} An object containing the best matching name(s) and the matching ratio.
 */
export const matchMixedInputName = (
  inputName: string,
  presetNameList: readonly string[],
): MatchResult => {
  let bestRatio = 0;
  let bestMatch: string[] = [];
  const inputChinesePart = extractChinese(inputName);
  const inputEnglishPart = splitName(extractEnglish(inputName));

  presetNameList.forEach((presetName) => {
    const chinesePart = extractChinese(presetName);
    const englishPart = splitName(extractEnglish(presetName));
    let ratio = 0;

    if (chinesePart.includes(inputChinesePart)) {
      ratio = inputChinesePart.length / chinesePart.length;
    }

    let matchParts = 0;

    inputEnglishPart.forEach((name) => {
      if (englishPart.includes(name)) {
        matchParts++;
      }
    });

    if (ratio === 0) {
      ratio = matchParts / (englishPart.length + chinesePart.length);
    } else {
      ratio = (inputChinesePart.length + matchParts) / (englishPart.length + chinesePart.length);
    }

    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestMatch = [presetName];
    } else if (ratio !== 0 && ratio === bestRatio) {
      bestMatch.push(presetName);
    }
  });

  return {
    bestMatch,
    bestRatio,
  };
};

/**
 * Matches the input name manually against preset names and returns the best match along with a message describing the match quality.
 *
 * @param {string} inputName - The input name to match, which can be in Chinese, English, or a mix of both.
 * @param {readonly string[]} presetNameList - The list of preset names to match against.
 * @return {NameMatchResponse} An object containing the best matching name(s) and a message indicating the match quality.
 */
export const matchNameManually = (
  inputName: string,
  presetNameList: readonly string[],
): NameMatchResponse => {
  let bestMatchResult = {
    bestMatch: [''],
    bestRatio: 0,
  };

  // check if input name is Chinese or English or mixed
  if (isChineseOnly(inputName)) {
    bestMatchResult = matchChineseName(inputName, presetNameList);
  } else if (isEnglishOnly(inputName)) {
    bestMatchResult = matchEnglishName(inputName, presetNameList);
  } else {
    // input name is mixed Chinese and English
    bestMatchResult = matchMixedInputName(inputName, presetNameList);
  }

  const { bestMatch, bestRatio } = bestMatchResult;

  let result: string = bestMatch.join(', ');
  let message = '';

  if (bestRatio === 1) {
    message = 'Match found, perfect match!';
  } else if (bestRatio >= 0.5 && bestRatio < 1) {
    message = 'Match found, partial match!';
  } else if (bestRatio > 0 && bestRatio < 0.5) {
    message = 'Match found, poor match!';
  } else {
    result = '';
    message = 'No match found.';
  }

  const response = {
    bestMatchName: result,
    message,
  };

  return response;
};
