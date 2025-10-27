const {
  ensureTriviaConfig,
  listTriviaRecords
} = require('./utils/airtableTrivia');

function escapeAirtableValue(value) {
  return value.replace(/'/g, "''");
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { Allow: 'GET' },
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

  const params = event.queryStringParameters || {};
  const pubId = typeof params.pubId === 'string' ? params.pubId.trim() : '';
  const maxRecords = parsePositiveInt(params.limit, 20);

  if (!pubId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'pubId query parameter is required.' })
    };
  }

  const filterByFormula = `{pubId} = '${escapeAirtableValue(pubId)}'`;

  try {
    const data = await listTriviaRecords({
      filterByFormula,
      maxRecords,
      sort: [
        { field: 'score', direction: 'desc' },
        { field: 'timeMs', direction: 'asc' },
        { field: 'createdAt', direction: 'asc' }
      ]
    });

    const items = (data.records || []).map((record) => ({
      id: record.id,
      playerName: record.fields?.playerName || 'Anonymous',
      score: record.fields?.score ?? 0,
      timeMs: record.fields?.timeMs ?? null,
      createdAt: record.fields?.createdAt || null
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ items })
    };
  } catch (error) {
    console.error('Failed to fetch trivia leaderboard:', error);
    return {
      statusCode: 502,
      body: JSON.stringify({
        error: 'Unable to load leaderboard right now.'
      })
    };
  }
};
