# EasyNotion

**A minimal Notion API wrapper without SDK**  
(Currently still under development)

---

## Features

- Retrieve database properties with optional detailed options  
- Query databases with filters  
- Query **all** database entries with automatic pagination  
- Create new pages in a database  
- Create new databases with simple property definitions  
- Append child blocks to any block or page  
- Easily create various block types:
  - Paragraph, headings, to-dos, bulleted lists, numbered lists  
  - Toggles with nested children  
  - Code blocks with language support  
  - Dividers, quotes, callouts  
  - Images via public URLs  
  - Page links to existing Notion pages  
- Archive pages by setting their archived status  
- Update properties of existing pages  
- Update page metadata including properties, icon, cover, archived status, and parent  
- Retrieve child blocks of a page or block  
- Clear all child blocks from a page or block  
- Delete individual blocks  
- Uses simple fetch requests with your Notion integration token  
- Lightweight and flexible — zero external dependencies  

---

## Installation

```bash
npm install git+https://github.com/Squidiis/EasyNotion.git
```

## Usage

```js
import { getDatabaseProperties } from 'easynotion';

// Initialize your client with your Notion API token
const notion = easynotion('your-integration-token');

// Example: Get database properties
async function example() {

  	const dbProperties = await notion.getDatabaseProperties('Database-id', { full: false });
	console.log('Existing database properties:', dbProperties);

	// 2. Create a new database on a specific parent page
	const newDatabase = await notion.createDatabase(
		"ID of the parent page",
		"Example", // Title of the new database
		{
		Name: { type: "title" }, // Title property
		Status: {
			type: "status",
			options: ["Open", "In Progress", "Done"] // Status options
			},
			Date: { type: "date" } // Due date
		}
	);
	console.log('New database created:', newDatabase);

	// 3. Define content blocks to add to the new page
	const blockChildren = [
		notion.createQuoteBlock('test quote'),      // Quote block
		notion.createDividerBlock(),                // Divider block
		notion.createParagraphBlock('test space')   // Paragraph block
	];

	// 4. Define the property values for the new page
	const newPageProperties = {
		Status: 'Offen', // Status value
		Name: 'Test'     // Title value
	};

	// 5. Create a new page (entry) in the newly created database
	const newPage = await notion.createPage(newDatabase.id, newPageProperties);
	console.log('New page created:', newPage);

	// 6. Append the content blocks to the new page
	await notion.appendBlockChildren(newPage.id, blockChildren);
	console.log('Blocks appended to new page');

}

example();
```

## API

### `getDatabaseProperties(databaseId, options)`

**Parameters:**  
- `databaseId` (string) — Notion database ID  
- `options` (object, optional) — Options object; e.g. `{ full: true }` to get detailed properties including options lists  

**Returns:**  
- Promise resolving to an object with database properties  

---

### `createDatabase(parentPageId, title, properties)`

**Parameters:**  
- `parentPageId` (string) — ID of the parent page where the database will be created  
- `title` (string) — Title of the new database  
- `properties` (object) — Simplified object defining properties, e.g.  
  ```js
  { 
    Name: "title", 
    Status: { type: "status", options: ["Open", "Done"] } 
  }
  ```  

**Returns:**  
- Promise resolving to the newly created database object  

---

### `queryDatabase(databaseId, filter)`

**Parameters:**  
- `databaseId` (string) — Notion database ID  
- `filter` (object, optional) — Notion API filter object to limit query results  

**Returns:**  
- Promise resolving to a single page of results matching the filter, including pagination info  

**Description:**  
Queries the specified database with optional filters, returning matching pages (max 100 per call).  

---

### `queryAllDatabase(databaseId, filter)`

**Parameters:**  
- `databaseId` (string) — Notion database ID  
- `filter` (object, optional) — Notion API filter object to limit query results  

**Returns:**  
- Promise resolving to an array with all pages matching the filter; handles pagination internally  

**Description:**  
Retrieves all pages from a database matching the filter, iterating over all pages automatically.  

---

### `getPage(pageId)`

**Parameters:**  
- `pageId` (string) — The ID of the Notion page to retrieve  

**Returns:**  
- Promise resolving to the page object  

**Description:**  
Fetches and returns the metadata and properties of a specific Notion page by its ID.

---

### `createPage(databaseId, properties)`

**Parameters:**  
- `databaseId` (string) — Notion database ID  
- `properties` (object) — Properties object following the Notion API format for the new page  

**Returns:**  
- Promise resolving to the created page object  

**Description:**  
Creates a new page in the specified database with given property values.  

---

### `appendBlockChildren(blockId, children)`

**Parameters:**  
- `blockId` (string) — ID of the parent block or page to append children to  <br>
- `children` (Array<Object>) — Array of block objects created by block builder functions  <br>

**Returns:**  
- Promise resolving to the Notion API response containing the updated block children  

**Description:**  
Appends child blocks to a specified block or page by calling the Notion API PATCH endpoint  
`/v1/blocks/{blockId}/children`.

---

### `archivePage(pageId)`

**Parameters:**  
- `pageId` (string) — ID of the page to archive  

**Returns:**  
- Promise resolving to the archived page object  

**Description:**  
Archives a Notion page by setting `archived: true`.

---

### `updatePageProperties(pageId, properties)`

**Parameters:**  
- `pageId` (string) — ID of the page to update  
- `properties` (object) — Properties to update, e.g. `{ Name: "New Title", Status: "Done" }`  

**Returns:**  
- Promise resolving to the updated page object  

**Description:**  
Updates the properties of an existing Notion page.  

---

### `updatePage(pageId, update)`

**Parameters:**  
- `pageId` (string) — ID of the page to update  
- `update` (object) — Update object with possible keys:  
  - `properties`: Object of property values to update  
  - `icon`: Emoji string, external URL string, or Notion icon object  
  - `cover`: External URL string for page cover image  
  - `archived`: Boolean to archive/unarchive the page  

**Returns:**  
- Promise resolving to the updated page object  

**Description:**  
Updates a Notion page’s metadata and properties, including icon, cover, archived status, and parent.  

---

### `getBlockChildren(blockId, pageSize)`

**Parameters:**  
- `blockId` (string) — ID of the block or page  
- `pageSize` (number, optional) — Number of results to fetch (max 100)  

**Returns:**  
- Promise resolving to a list of child blocks  

---

### `clearPage(blockId)`

**Parameters:**  
- `blockId` (string) — ID of the page or block whose children should be removed  

**Returns:**  
- Promise resolving to void  

**Description:**  
Clears all child blocks from a Notion page or block.  

---

### `deleteBlock(blockId)`

**Parameters:**  
- `blockId` (string) — ID of the block to delete  

**Returns:**  
- Promise resolving to the API response object  

**Description:**  
Deletes a block by removing it from the page.  

---

## Block Builder Functions

_All functions return objects formatted according to the Notion API specification to represent blocks._

- `createParagraphBlock(text)`  
  Creates a paragraph block with the provided text.  

- `createHeadingBlock(text, level)`  
  Creates a heading block at level 1, 2, or 3 with the given text.  

- `createToDoBlock(text, checked)`  
  Creates a to-do (checkbox) block; `checked` is a boolean indicating if the box is checked.  

- `createBulletedListBlock(text)`  
  Creates a bulleted list item block with the specified text.  

- `createNumberedListBlock(text)`  
  Creates a numbered list item block with the given text.  

- `createToggleBlock(text, children)`  
  Creates a toggle block with title `text` and optional child blocks `children` (an array of block objects).  

- `createDividerBlock()`  
  Creates a divider block (horizontal line).  

- `createCodeBlock(code, language)`  
  Creates a code block with source code `code` and programming language `language` (e.g., `"javascript"`, `"python"`).  

- `createImageBlock(imageUrl)`  
  Creates an image block with the public image URL `imageUrl`.  

- `createCalloutBlock(text, icon)`  
  Creates a callout block with content `text` and optional icon (emoji or image URL) `icon`.  

- `createQuoteBlock(text)`  
  Creates a quote block with the text `text`.  

- `createPageLinkBlock(pageId)`  
  Creates a link to an existing Notion page by its `pageId`.  

---

## Notes
Make sure your token has the necessary permissions for the target database

This library does not use the official Notion SDK, only direct HTTP requests