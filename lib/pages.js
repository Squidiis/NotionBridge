import { formatProperties } from './utils/formatProperties.js';
import { formatFilter } from './utils/formatFilter.js';
import { normalizeInputProperties } from './utils/normalizeInputProperties.js';
import { getDatabaseProperties } from './database.js';
import { normalizeIconOrCover } from './utils/normalizeIconOrCover.js';


async function queryDatabase(notionFetch, token, databaseId, userFilter = {}) {

	const schemaResult = await getDatabaseProperties(notionFetch, token, databaseId, { full: true });
	const schema = schemaResult.details;

	let filter = undefined;
	if (Object.keys(userFilter).length > 0) {
		filter = formatFilter(userFilter, schema);
	}

	const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

	const response = await notionFetch(url, token, {
		method: 'POST',
		body: { filter }
	});

	return response;
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


async function getPage(notionFetch, token, pageId) {

	const url = `https://api.notion.com/v1/pages/${pageId}`;
	return notionFetch(url, token);
}


async function createPage(notionFetch, token, databaseId, properties) {
  
	const schema = await getDatabaseProperties(notionFetch, token, databaseId, { full: true });
	const formattedProps = formatProperties(properties, schema.details);

	const body = {
		parent: { database_id: databaseId },
		properties: formattedProps
	};

	const response = await notionFetch('https://api.notion.com/v1/pages', token, {
		method: 'POST',
		body
	});

	return response;
}


async function archivePage(notionFetch, token, pageId) {
	
	if (!pageId || typeof pageId !== 'string') {
		throw new Error(`Invalid pageId provided: ${pageId}`);
	}

	const url = `https://api.notion.com/v1/pages/${pageId}`;

	const response = await notionFetch(url, token, {
		method: 'PATCH',
		body: {
		archived: true
		}
	});

	return response;
}


async function updatePage(notionFetch, token, pageId, update) {
  if (!pageId || typeof pageId !== 'string') {
    throw new Error(`Invalid pageId: ${pageId}`);
  }

  const body = {};

  if (update.icon) {
    body.icon = normalizeIconOrCover(update.icon);
  }

  if (update.cover) {
    body.cover = normalizeIconOrCover(update.cover);
  }

  if (typeof update.archived === 'boolean') {
    body.archived = update.archived;
  }

  if (update.properties) {

    const formattedProperties = {};

    for (const [key, value] of Object.entries(update.properties)) {
      if (key === "Name") {

        formattedProperties[key] = {
          title: [
            {
              type: 'text',
              text: { content: value }
            }
          ]
        };
      } else {

        formattedProperties[key] = {
          rich_text: [
            {
              type: 'text',
              text: { content: String(value) }
            }
          ]
        };
      }
    }

    body.properties = formattedProperties;
  }

  const url = `https://api.notion.com/v1/pages/${pageId}`;

  const response = await notionFetch(url, token, {
    method: 'PATCH',
    body,
  });

  return response;
}


async function getBlockChildren(notionFetch, token, blockId, pageSize = 100) {

  	const url = `https://api.notion.com/v1/blocks/${blockId}/children?page_size=${pageSize}`;
	
	const response = await notionFetch(url, token, {
		method: 'GET'
	});

	return response
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


async function deleteBlock(notionFetch, token, blockId) {

	if (!blockId || typeof blockId !== 'string') {
		throw new Error(`Invalid blockId provided: ${blockId}`);
	}

	const url = `https://api.notion.com/v1/blocks/${blockId}`;

	const response = await notionFetch(url, token, {
		method: 'DELETE'
	});

	return response;
}


async function clearPage(notionFetch, token, blockId) {

	if (!blockId || typeof blockId !== 'string') {
		throw new Error(`Invalid blockId provided: ${blockId}`);
	}

	const url = `https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`;

	const childrenResponse = await notionFetch(url, token, {
		method: 'GET'
	});

	const blocks = childrenResponse.results || [];

	for (const block of blocks) {
		await notionFetch(`https://api.notion.com/v1/blocks/${block.id}`, token, {
		method: 'DELETE'
		});
	}
}


export { 
	queryDatabase, 
	queryAllDatabase, 
	getPage, 
	createPage,
	getBlockChildren, 
	appendBlockChildren, 
	archivePage, 
	updatePage, 
	deleteBlock, 
	clearPage
};