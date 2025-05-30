import { formatProperties } from './utils/formatProperties.js';
import { formatFilter } from './utils/formatFilter.js';
import { getDatabaseProperties } from './database.js';


async function queryDatabase(notionFetch, token, databaseId, userFilter = {}) {

	const schemaResult = await getDatabaseProperties(notionFetch, token, databaseId, { full: true });
	const schema = schemaResult.details;

	let filter = undefined;
	if (Object.keys(userFilter).length > 0) {
		filter = formatFilter(userFilter, schema);
	}

	const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

	const data = await notionFetch(url, token, {
		method: 'POST',
		body: { filter }
	});

	return data;
}


async function queryAllDatabase(notionFetch, token, databaseId, userFilter = {}) {

	const schemaResult = await getDatabaseProperties(notionFetch, token, databaseId, { full: true });
	const schema = schemaResult.details;

	let filter = undefined;
	if (Object.keys(userFilter).length > 0) {
		filter = formatFilter(userFilter, schema);
	}

	const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

	let results = [];
	let start_cursor = undefined;

	do {
		const body = {
		start_cursor,
		filter,
		};

		const response = await notionFetch(url, token, {
		method: 'POST',
		body,
		});

		results = results.concat(response.results);
		start_cursor = response.has_more ? response.next_cursor : undefined;

	} while (start_cursor);

	return results;
}


async function createPage(notionFetch, token, databaseId, properties) {
  
	const schema = await getDatabaseProperties(notionFetch, token, databaseId, { full: true });
	const formattedProps = formatProperties(properties, schema.details);

	const body = {
		parent: { database_id: databaseId },
		properties: formattedProps
	};

	const result = await notionFetch('https://api.notion.com/v1/pages', token, {
		method: 'POST',
		body
	});

	return result;
}


async function appendBlockChildren(notionFetch, token, blockId, children) {

	if (!blockId || typeof blockId !== 'string') {
   		throw new Error(`Invalid blockId provided: ${blockId}`);
  	}

  	const url = `https://api.notion.com/v1/blocks/${blockId}/children`;

	const response = await notionFetch(url, token, {
		method:'PATCH',
		body: { children }
	});

	return response
}


export { queryDatabase, queryAllDatabase, createPage, appendBlockChildren };