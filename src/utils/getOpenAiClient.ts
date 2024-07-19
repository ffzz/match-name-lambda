import * as dotenv from 'dotenv';
import OpenAI from 'openai';

// load dotenv
dotenv.config();

// singleton
let instance: OpenAI | null = null;

/**
 * Returns a singleton instance of the OpenAI client.
 *
 * @return {OpenAI} The singleton instance of the OpenAI client.
 */
export function getOpenAIClient(): OpenAI {
  if (!instance) {
    instance = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
  }
  return instance;
}
