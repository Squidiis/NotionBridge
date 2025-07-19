import { getDatabaseProperties, createDatabase } from './lib/database.js';
import { 
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
    } from './lib/pages.js';
import { 
    createParagraphBlock, 
    createHeadingBlock,
    createToDoBlock, 
    createBulletedListBlock, 
    createNumberedListBlock,
    createToggleBlock,
    createDividerBlock,
    createCodeBlock,
    createImageBlock,
    createCalloutBlock,
    createQuoteBlock,
    createPageLinkBlock
    } from './lib/blocks.js';
import { markdownToBlocks } from './lib/markdownToBlocks.js';
import { blocksToMarkdown } from './lib/blocksToMarkdown.js';

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
        let errorData = null;
        let errorDetails = {};

        try {
            errorData = await res.json();

            if (errorData && errorData.message) {
                errorMessage += `: ${errorData.message}`;
                errorDetails.message = errorData.message;
                errorDetails.code = errorData.code;
                errorDetails.status = res.status;
                errorDetails.url = url;
                errorDetails.method = options.method || 'GET';
                if (options.body) errorDetails.body = options.body;

                switch (errorData.code) {
                    case 'validation_error':
                        errorMessage += ` — Validation failed. Check your properties and values.`;
                        break;
                    case 'unauthorized':
                        errorMessage += ` — Unauthorized: Invalid or missing API token.`;
                        break;
                    case 'object_not_found':
                        errorMessage += ` — Object not found: Check your database or page ID.`;
                        break;
                    case 'rate_limited':
                        errorMessage += ` — Rate limited: Too many requests.`;
                        break;
                    case 'internal_server_error':
                        errorMessage += ` — Notion internal server error.`;
                        break;
                }
            } else {
                errorMessage += `: ${JSON.stringify(errorData)}`;
            }
        } catch (e) {
            const text = await res.text();
            errorMessage += `: ${text}`;
            errorDetails.raw = text;
        }

        errorDetails.request = {
            url,
            method: options.method || 'GET',
            headers: options.headers,
            body: options.body
        };
        errorDetails.timestamp = new Date().toISOString();

        const error = new Error(errorMessage);
        error.notion = errorDetails;
        error.status = res.status;
        error.code = errorData?.code;
        error.url = url;
        error.requestBody = options.body;
        error.response = errorData;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(error, notionFetch);
        }

        throw error;
    }

    return res.json();
}


function notionbridge(token) {
  
    if (!token) throw new Error('API Token is missing!');

    return {

    /**
    * Returns properties of the database, optionally with full options list
    * 
    * @param {string} databaseId - ID of the Notion database
    * @param {Object} options - Additional options
    * @returns {Promise<Object>} Database properties object
    */    
    getDatabaseProperties: (databaseId, options) =>
        getDatabaseProperties(notionFetch, token, databaseId, options),


    /**
     * Creates a new Notion database with simplified property input
     * 
     * @param {string} parentPageId - ID of the parent page where the database will be created
     * @param {string} title - Title of the new database
     * @param {Object} properties - Simplified properties definition (e.g., { Name: "title", Status: { type: "status", options: ["Open", "Done"] } })
     * @returns {Promise<Object>} Newly created database object
     */
    createDatabase: (parentPageId, title, properties) =>
        createDatabase(notionFetch, token, parentPageId, title, properties),


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
    * 
    * @param {string} databaseId
    * @param {Object} filter - Simplified filter object
    * @returns {Promise<Object>} Query results
    */
    queryDatabase: (databaseId, filter) =>
        queryDatabase(notionFetch, token, databaseId, filter),

    /**
    * Fetches full page data from Notion.
    * 
    * @param {string} pageId - The ID of the page.
    * @returns {Promise<Object>} Notion page object.
    */
    getPage: (pageId) =>
        getPage(notionFetch, token, pageId),

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
     * Archives a Notion page by setting `archived: true`
     * 
     * @param {Function} notionFetch - The fetch wrapper with headers and error handling
     * @param {string} token - Your Notion integration token
     * @param {string} pageId - The ID of the page to archive
     * @returns {Promise<Object>} The archived page object
     */
    archivePage: (pageId) =>
        archivePage(notionFetch, token, pageId),

    /**
    * Updates a Notion page's metadata and properties.
    * Supports updating page properties, icon, cover, archived status, and parent.
    * 
    * @param {string} pageId - ID of the Notion page to update
    * @param {Object} update - Update object. Possible keys:
    *   - properties: Object with property values to update (e.g. { Name: "New Title" })
    *   - icon: Emoji string or external URL string or Notion icon object
    *   - cover: External URL string for the page cover image
    *   - archived: Boolean to archive/unarchive the page
    * @returns {Promise<Object>} Updated page object
    */
    updatePage: (pageId, update) => 
        updatePage(notionFetch, token, pageId, update),

    /**
    * Retrieves the child blocks of a given Notion block or page.
    *
    * @param {string} blockId - The ID of the block or page.
    * @param {number} [pageSize=100] - Number of results to fetch per request (max 100).
    * @param {boolean} [getAll=false] - If true, fetches all child blocks by following pagination (`next_cursor`).
    * @returns {Promise<Object>} - If getAll is true: { results: BlockObject[] }, else: raw Notion API response with pagination info.
    */
    getBlockChildren: (blockId, pageSize, getAll) =>
        getBlockChildren(notionFetch, token, blockId, pageSize, getAll),

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
     * Clears all child blocks from a Notion page or block,
     * then fetches and returns the updated page/block object.
     * 
     * @param {Function} notionFetch - The fetch wrapper
     * @param {string} token - Your Notion integration token
     * @param {string} blockId - ID of the page or block whose children should be removed
     * @returns {Promise<Object>} The updated page or block object after clearing its children
     */
    clearPage: (blockId) =>
        clearPage(notionFetch, token, blockId),

    /**
     * Deletes a block (removes it from the page)
     * 
     * @param {Function} notionFetch - The fetch wrapper with headers and error handling
     * @param {string} token - Your Notion integration token
     * @param {string} blockId - The ID of the block to delete
     * @returns {Promise<Object>} API response object
     */
    deleteBlock: (blockId) =>
        deleteBlock(notionFetch, token, blockId),

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

    /**
     * Creates a numbered list item block
     * 
     * @param {string} text - The content of the list item
     * @returns {Object} Numbered list block object
     */
    createNumberedListBlock: (text) =>
        createNumberedListBlock(text),

    /**
     * Creates a toggle block that can contain nested children
     * 
     * @param {string} text - The toggle title
     * @param {Array<Object>} children - Array of child block objects
     * @returns {Object} Toggle block object
     */
    createToggleBlock: (text, children) =>
        createToggleBlock(text, children),

    /**
     * Creates a divider block (horizontal line)
     * 
     * @returns {Object} Divider block object
     */
    createDividerBlock: () =>
        createDividerBlock(),


    /**
     * Creates a code block
     * 
     * @param {string} code - The code content
     * @param {string} language - The language of the code (e.g., "javascript", "python")
     * @returns {Object} Code block object
     */
    createCodeBlock: (code, language) =>
        createCodeBlock(code, language),


    /**
     * Creates an image block
     * 
     * @param {string} imageUrl - Public URL of the image
     * @returns {Object} Image block object
     */
    createImageBlock: (imageUrl) =>
        createImageBlock(imageUrl),


    /**
     * Creates a callout block
     * 
     * @param {string} text - The callout content
     * @param {string} [icon] - Optional emoji or external URL for the icon
     * @returns {Object} Callout block object
     */
    createCalloutBlock: (text, icon) =>
        createCalloutBlock(text, icon),

    /**
     * Creates a quote block
     * 
     * @param {string} text - The quoted text
     * @returns {Object} Quote block object
     */
    createQuoteBlock: (text) =>
        createQuoteBlock(text),

    /**
     * Creates a link to an existing Notion page
     * 
     * @param {string} pageId - ID of the target Notion page
     * @returns {Object} Link to page block object
     */
    createPageLinkBlock: (pageId) =>
        createPageLinkBlock(pageId),

    /**
     * Converts Markdown text to an array of Notion block objects.
     * 
     * @param {string} markdown - Markdown string to convert.
     * @returns {Array} Array of Notion block objects.
     */
    markdownToBlocks: (markdown) =>
        markdownToBlocks(markdown),

    /**
     * Converts an array of Notion block objects to Markdown string.
     * 
     * @param {Array} blocks - Array of mapped Notion block objects (e.g. from mapResponse or getBlockChildren)
     * @returns {string} Markdown string
     */
    blocksToMarkdown: (blocks) =>
        blocksToMarkdown(blocks),

    /**
    * Maps a raw Notion API response (page, database, block, or list)
    * into a simplified, flat JavaScript object that is easier to work with.
    * Supports automatic mapping of Notion Pages (with properties),
    * Databases (with schema overview), Blocks (with text, type, etc.),
    * and Lists (arrays of any of the above).
    * 
    * @param {Object} notionResponse - The raw response object from the Notion API
    * @returns {Object|Array} A simplified version of the response object
    */
    mapResponse: (notionResponse) =>
        mapResponse(notionResponse),

    };
};


export { notionbridge };