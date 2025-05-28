import { getDatabaseProperties } from './lib/database.js';
import { queryDatabase, queryAllDatabase } from './lib/pages.js';


// Notion version
const NOTION_VERSION = '2022-06-28';

// Central fetch function used by the wrapper
async function notionFetch(url, token, options = {}) {

    const res = await fetch(url, {
        method: options.method || 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        throw new Error(`Notion API Fehler ${res.status}: ${await res.text()}`);
    }
    return res.json();
}

function init(token) {
  
    if (!token) throw new Error('API Token fehlt!');

    return {
    getDatabaseProperties: (databaseId, options) =>
      getDatabaseProperties(notionFetch, token, databaseId, options),

    queryDatabase: (databaseId, filter) =>
      queryDatabase(notionFetch, token, databaseId, filter),

    queryAllDatabase: (databaseId, filter) =>
      queryAllDatabase(notionFetch, token, databaseId, filter),
  };
}

export { init };