export interface NameMatchResponse {
  bestMatchName: string;
  message: string;
}

export interface MatchResult {
  bestMatch: string[];
  bestRatio: number;
}
