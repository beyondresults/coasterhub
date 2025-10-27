const {
  ensureTriviaConfig,
  createTriviaRecord
} = require('./utils/airtableTrivia');

function sanitizeName(name) {
  return name.trim().slice(0, 60);
}

function isValidScore(value) {
  return Number.isInteger(value) && value >= 0 && value <= 50;
}

function isValidTime(value) {
  return Number.isInteger(value) && value >= 0 && value <= 60 * 60 * 1000;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    ensureTriviaConfig();
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Trivia scoreboard is not configured.' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload.' })
    };
  }

  const pubId = typeof payload.pubId === 'string' ? payload.pubId.trim() : '';
  const playerName =
    typeof payload.playerName === 'string' ? sanitizeName(payload.playerName) : '';
  const score = Number.isFinite(payload.score)
    ? Math.round(Number(payload.score))
    : NaN;
  const timeMs = Number.isFinite(payload.timeMs)
    ? Math.round(Number(payload.timeMs))
    : NaN;

  if (!pubId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'pubId is required.' })
    };
  }

  if (!playerName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'playerName is required.' })
    };
  }

  if (!isValidScore(score)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'score must be an integer between 0 and 50.' })
    };
  }

  if (!isValidTime(timeMs)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'timeMs must be a positive integer representing milliseconds.'
      })
    };
  }

  try {
    const result = await createTriviaRecord({
      pubId,
      playerName,
      score,
      timeMs
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        recordId: result.id || (result.records && result.records[0]?.id) || null
      })
    };
  } catch (error) {
    console.error('Failed to submit trivia score:', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Unable to save score right now.' })
    };
  }
};
