import { PROMPT } from '@/constant/promtForAI';
import { NameMatchResponse } from '@/types/reponseType';
import CustomError from '@/customError/CustomErrorClass';
import { getOpenAIClient } from '@/utils/getOpenAiClient';

/**
 * Asynchronously matches the provided name using AI.
 *
 * @param {string} name - The name to match via AI.
 * @return {Promise<NameMatchResponse>} The response containing the best match name and a message.
 */
export const matchNameViaAi = async (name: string): Promise<NameMatchResponse> => {
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: `The name I would like to match is ${name}` },
      ],
      model: 'gpt-4o',
    });

    const response = completion.choices[0].message.content || '';

    const message = JSON.parse(response) as NameMatchResponse;

    return message;
  } catch (error) {
    throw new CustomError('Failed to match name via AI.', 500);
  }
};
