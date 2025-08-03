<p align="center">
  <img src="./Banner.png" alt="Notion Bridge" width="100%"/>
</p>

# NotionBridge

**A minimal Notion API wrapper without SDK**  
(Currently under development)  
Docs: https://squidiis.github.io/NotionBridge-docs/#intro

## Features

- Retrieve database properties (with or without full option details)
- Query databases with simple filters
- Query **all** database entries with automatic pagination
- Create new pages in a database
- Create new databases with simple property definitions
- Add or select new values in select/multi-select fields dynamically
- Append child blocks to any block or page
- Easily create various block types:
  - Paragraph, headings, to-dos, bulleted lists, numbered lists
  - Toggles with nested children
  - Code blocks with language support
  - Dividers, quotes, callouts
  - Images via public URLs
  - Page links to existing Notion pages
- Archive pages by setting their archived status
- Update properties and metadata of existing pages (icon, cover, archived, etc.)
- Retrieve child blocks of a page or block (with pagination or all at once)
- Clear all child blocks from a page or block
- Delete individual blocks
- Uses simple fetch requests with your Notion integration token
- Lightweight and flexible — zero external dependencies

## Installation

```bash
npm install git+https://github.com/Squidiis/NotionBridge.git
```

## Quickstart

```js
import { notionbridge } from 'notionbridge';

// Initialize your client with your Notion API token
const notion = notionbridge('your-integration-token');
```

## Usage Example

```js
// 1. Get database properties (schema)
const dbProperties = await notion.getDatabaseProperties('your-database-id', { full: false });
console.log('Database properties:', dbProperties);

// 2. Create a new database on a parent page
const newDatabase = await notion.createDatabase(
  "parent-page-id",
  "Example Database",
  {
    Name: { type: "title" },
    Status: { type: "status", options: ["Open", "In Progress", "Done"] },
    Date: { type: "date" }
  }
);
console.log('New database created:', newDatabase);

// 3. Define content blocks to add to a new page
const blockChildren = [
  notion.createQuoteBlock('test quote'),
  notion.createDividerBlock(),
  notion.createParagraphBlock('test space')
];

// 4. Define property values for the new page
const newPageProperties = {
  Status: 'Open',
  Name: 'Test'
};

// 5. Create a new page (entry) in the database
const newPage = await notion.createPage(newDatabase.id, newPageProperties);
console.log('New page created:', newPage);

// 6. Append blocks to the new page
await notion.appendBlockChildren(newPage.id, blockChildren);
console.log('Blocks appended to new page');
```

## API Overview

- `notion.getDatabaseProperties(databaseId, options)`
- `notion.createDatabase(parentPageId, title, properties)`
- `notion.queryDatabase(databaseId, filter)`
- `notion.queryAllDatabase(databaseId, filter)`
- `notion.getPage(pageId)`
- `notion.createPage(databaseId, properties)`
- `notion.archivePage(pageId)`
- `notion.updatePage(pageId, updateObject)`
- `notion.addSelectOption(pageId, propertyName, newOption, multiSelect)`
- `notion.getBlockChildren(blockId, pageSize, getAll)`
- `notion.appendBlockChildren(blockId, children)`
- `notion.clearPage(blockId)`
- `notion.deleteBlock(blockId)`
- Block builder helpers:  
  - `notion.createParagraphBlock(text)`
  - `notion.createHeadingBlock(text, level)`
  - `notion.createToDoBlock(text, checked)`
  - `notion.createBulletedListBlock(text)`
  - `notion.createNumberedListBlock(text)`
  - `notion.createToggleBlock(text, children)`
  - `notion.createDividerBlock()`
  - `notion.createCodeBlock(code, language)`
  - `notion.createImageBlock(imageUrl)`
  - `notion.createCalloutBlock(text, icon)`
  - `notion.createQuoteBlock(text)`
  - `notion.createPageLinkBlock(pageId)`
  - `notion.markdownToBlocks(markdown)` — Converts Markdown to Notion block objects
  - `notion.blocksToMarkdown(blocks)` — Converts Notion blocks to Markdown string
- `notion.mapResponse(notionApiResponse)` — Flattens Notion API responses for easier use

## Notes

- Make sure your integration token has access to the target workspace and databases.
- This library does **not** use the official Notion SDK, only direct HTTP requests.
- All API calls are async and return Promises.
- For more advanced usage and documentation, see [the docs](https://squidiis.github.io/NotionBridge-docs/#intro).
