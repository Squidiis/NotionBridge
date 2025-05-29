import { getDatabaseProperties } from './lib/database.js';
import { queryDatabase, queryAllDatabase, createPage, appendBlockChildren } from './lib/pages.js';
import { createParagraphBlock, createHeadingBlock, createToDoBlock, createBulletedListBlock } from './lib/blocks.js';

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

        let errorMessage = `Notion API ERROR ${res.status}`;

        try {
            const errorData = await res.json();

            if (errorData && errorData.message) {
                errorMessage += `: ${errorData.message}`;
                
                if (errorData.code === 'validation_error') {
                errorMessage += ` — Validation failed. Check your properties and values.`;
                } else if (errorData.code === 'unauthorized') {
                errorMessage += ` — Unauthorized: Invalid or missing API token.`;
                } else if (errorData.code === 'object_not_found') {
                errorMessage += ` — Object not found: Check your database or page ID.`;
                }
            }
        } catch {
            errorMessage += `: ${await res.text()}`;
        }

        throw new Error(errorMessage);
    }

  return res.json();
}


function notionbridge(token) {
  
    if (!token) throw new Error('API Token is missing!');

    return {

    /**
    * Returns properties of the database, optionally with full options list
    * @param {string} databaseId - ID of the Notion database
    * @param {Object} options - Additional options
    * @returns {Promise<Object>} Database properties object
    */    getDatabaseProperties: (databaseId, options) =>
        getDatabaseProperties(notionFetch, token, databaseId, options),


    /**
     * Queries the entire Notion database by repeatedly fetching pages until all results are retrieved.
     * Supports a simplified filter object, which will be converted to Notion API filter format.
     *
     * @param {Function} notionFetch - Central fetch function for Notion API calls
     * @param {string} token - Notion API token
     * @param {string} databaseId - ID of the Notion database
     * @param {Object} [userFilter={}] - Simple filter object, e.g. { Status: "In Progress" }
     * @returns {Promise<Array>} Array of all page results from the database query
     *
     * @throws Will throw an error if the Notion API call fails
     */
    queryAllDatabase: (databaseId, userFilter) =>
        queryAllDatabase(notionFetch, token, databaseId, userFilter),


    /**
    * Executes a simple query on the database, returning first page of results
    * @param {string} databaseId
    * @param {Object} filter - Simplified filter object
    * @returns {Promise<Object>} Query results
    */
    queryDatabase: (databaseId, filter) =>
        queryDatabase(notionFetch, token, databaseId, filter),

    /**
    * Creates a new page in the specified Notion database.
    * 
    * @param {string} databaseId - The ID of the Notion database where the page will be created.
    * @param {Object} properties - An object representing the page properties and their values.
    *                              The properties must match the database schema.
    * @returns {Object} The newly created page object returned by the Notion API.
    */
    createPage: (databaseId, properties) =>
        createPage(notionFetch, token, databaseId, properties),

    /**
     * Appends child blocks to a parent block in Notion.
     *
     * @param {string} blockId - The ID of the parent block to which children will be appended.
     * @param {Array<Object>} children - An array of block objects representing the children to append.
     * @returns {Promise<Object>} - Returns a promise resolving to the API response object containing the updated block info.
     *
     * This function sends a PATCH request to the Notion API endpoint
     * `/v1/blocks/{blockId}/children` to add new child blocks under the specified parent block.
     */
    appendBlockChildren: (blockId, children) =>
        appendBlockChildren(notionFetch, token, blockId, children),

    /**
     * Creates a paragraph block object formatted for the Notion API.
     *
     * @param {string} text - The text content of the paragraph.
     * @returns {Object} - Returns a block object representing a paragraph with the given text.
     *
     * This block can be used directly in API calls to add paragraphs to pages or blocks.
     */
    createParagraphBlock: (text) =>
        createParagraphBlock(text),

    /**
     * Creates a heading block object for the specified heading level.
     *
     * @param {string} text - The text content of the heading.
     * @param {number} level - Heading level (1, 2, or 3), corresponding to heading_1, heading_2, or heading_3 in Notion.
     * @returns {Object} - Returns a heading block object structured according to the Notion API.
     *
     * This block is used to add headings of different sizes to Notion pages.
     */
    createHeadingBlock: (text, level) =>
        createHeadingBlock(text, level),

    /**
     * Creates a to-do block object representing a checklist item.
     *
     * @param {string} text - The description text of the to-do item.
     * @param {boolean} checked - Whether the to-do is completed (true) or not (false).
     * @returns {Object} - Returns a to-do block object compatible with the Notion API.
     *
     * This block can be added to a page to represent tasks or checklist items.
     */
    createToDoBlock: (text, checked) =>
        createToDoBlock(text, checked),

    /**
     * Creates a bulleted list item block.
     *
     * @param {string} text - The content of the bulleted list item.
     * @returns {Object} - Returns a bulleted list item block formatted for the Notion API.
     *
     * This block can be appended to pages or other blocks to create bulleted lists.
     */
    createBulletedListBlock: (text) =>
        createBulletedListBlock(text),

    };
};


export { notionbridge };