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
        throw new Error(`Notion API ERROR ${res.status}: ${await res.text()}`);
    }
    return res.json();
}

function notionbridge(token) {
  
    if (!token) throw new Error('API Token is missing!');

    return {

    // Returns properties of the database, optionally with full options list
    getDatabaseProperties: (databaseId, options) =>
        getDatabaseProperties(notionFetch, token, databaseId, options),

    // Queries the database once, returns first page of results (max 100 entries)
    queryDatabase: (databaseId, filter) =>
        queryDatabase(notionFetch, token, databaseId, filter),

    // Queries the database repeatedly to get all pages, returns full list of entries
    queryAllDatabase: (databaseId, filter) =>
        queryAllDatabase(notionFetch, token, databaseId, filter),
    };
};


export { notionbridge };