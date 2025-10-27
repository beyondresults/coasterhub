const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_TRIVIA_TABLE
} = process.env;

const AIRTABLE_BASE_URL = AIRTABLE_BASE_ID
  ? `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`
  : null;

const AIRTABLE_HEADERS = AIRTABLE_API_KEY
  ? {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  : null;

function ensureTriviaConfig() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TRIVIA_TABLE) {
    throw new Error('Airtable trivia configuration is incomplete.');
  }
}

function getTriviaTableUrl() {
  ensureTriviaConfig();
  return new URL(
    `${AIRTABLE_BASE_URL}/${encodeURIComponent(AIRTABLE_TRIVIA_TABLE)}`
  );
}

async function createTriviaRecord(fields) {
  const url = getTriviaTableUrl();

  const response = await fetch(url, {
    method: 'POST',
    headers: AIRTABLE_HEADERS,
    body: JSON.stringify({ fields })
  });

  const body = await response.json();
  if (!response.ok) {
    const message =
      body && body.error && body.error.message
        ? body.error.message
        : 'Failed to create Airtable record.';
    throw new Error(message);
  }

  return body;
}

async function listTriviaRecords({ filterByFormula, sort = [], maxRecords }) {
  const url = getTriviaTableUrl();

  if (filterByFormula) {
    url.searchParams.append('filterByFormula', filterByFormula);
  }

  if (maxRecords) {
    url.searchParams.append('maxRecords', String(maxRecords));
  }

  sort.forEach(({ field, direction }, index) => {
    if (!field) {
      return;
    }
    url.searchParams.append(`sort[${index}][field]`, field);
    url.searchParams.append(
      `sort[${index}][direction]`,
      direction === 'desc' ? 'desc' : 'asc'
    );
  });

  const response = await fetch(url, {
    headers: AIRTABLE_HEADERS
  });

  const body = await response.json();
  if (!response.ok) {
    const message =
      body && body.error && body.error.message
        ? body.error.message
        : 'Failed to fetch Airtable records.';
    throw new Error(message);
  }

  return body;
}

module.exports = {
  ensureTriviaConfig,
  createTriviaRecord,
  listTriviaRecords
};
