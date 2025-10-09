const AIRTABLE_WEBHOOK_URL = process.env.AIRTABLE_FEEDBACK_WEBHOOK_URL;

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Allow': 'POST' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    if (!AIRTABLE_WEBHOOK_URL) {
        console.error('Missing AIRTABLE_FEEDBACK_WEBHOOK_URL environment variable.');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Feedback destination is not configured.' })
        };
    }

    let payload;
    try {
        payload = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON payload.' })
        };
    }

    const { venue_id, message } = payload || {};
    if (!venue_id || !message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Both venue_id and message are required.' })
        };
    }

    try {
        const response = await fetch(AIRTABLE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ venue_id, message })
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.error('Airtable webhook error:', response.status, responseText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to submit feedback.' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error forwarding feedback:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unable to submit feedback at this time.' })
        };
    }
};
