import axios from 'axios';

test('responds to verification request', async () => {
  const client = axios.create({
    baseURL: 'http://localhost:9001/',
    timeout: 2000,
  });

  const getResponse = await client.get(
    `/generateWorkoutMarkdown?hub.mode=subscribe&hub.challenge=challengetoken&hub.verify_token=${
      process.env.STRAVA_VERIFY_TOKEN
    }`
  );

  expect(getResponse.data).toEqual({ 'hub.challenge': 'challengetoken' });
});

test('responds with an error code when token is incorrect', () => {
  const client = axios.create({
    baseURL: 'http://localhost:9001/',
    timeout: 2000,
  });

  expect(
    client.get(
      `/generateWorkoutMarkdown?hub.mode=subscribe&hub.challenge=challengetoken&hub.verify_token=badtoken`
    )
  ).rejects.toThrow('error');
});
