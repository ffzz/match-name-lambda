import { getOpenAIClient } from '@/utils/getOpenAiClient';

test('should return the same OpenAI instance', () => {
  const client1 = getOpenAIClient();
  const client2 = getOpenAIClient();

  expect(client1).toBe(client2);
});
