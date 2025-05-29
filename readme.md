# easynotion

**A minimal Notion API wrapper without SDK**  
(Currently still under development)

---

## Features

- Retrieve database properties with optional detailed options  
- Query databases with filters  
- Query **all** database entries with automatic pagination  
- Create new pages in a database  
- Append child blocks to any block or page  
- Create various block types easily: paragraph, headings, to-dos, bulleted lists  
- Uses simple fetch requests with your Notion integration token  
- Lightweight and flexible — zero external dependencies 

---

## Installation

```bash
npm install notionbridge
```

## Usage

```js
import { getDatabaseProperties } from 'notionbridge';

// Initialize your client with your Notion API token
const notion = notionbridge('your-integration-token');

// Example: Get database properties
async function example() {
  try {
    
    const props = await notion.getDatabaseProperties('your-database-id', { full: true });
    console.log('Database properties:', props);

    // Query the database with a filter
    const queryResult = await notion.queryDatabase('your-database-id', {
      filter: {
        property: 'Status',
        select: {
          equals: 'In Progress'
        }
      }
    });
    console.log('Filtered query result:', queryResult);

    // Query all pages in the database (pagination handled internally)
    const allPages = await notion.queryAllDatabase('your-database-id');
    console.log('All pages:', allPages);
  } catch (error) {
    console.error('Error:', error);
  }
}

example();
```

## API

`getDatabaseProperties(databaseId, options)`  
Parameters:  
- `databaseId (string)` — The Notion database ID
- `options` (object, optional) — Options object; { full: true } to get detailed properties including options lists
Returns:  
- Promise resolving to an object with database properties

`queryDatabase(databaseId, filter)`  
Parameters:  
- `databaseId` (string): The Notion database ID
- `filter` (object, optional): Notion API filter object to limit query results
Returns:  
- Promise resolving to a single page of results matching the filter, including pagination info
Description:  
Queries the specified database with optional filters, returning matching pages (max 100 per call).

`queryAllDatabase(databaseId, filter)`  
Parameters:  
- `databaseId` (string): The Notion database ID
- `filter` (object, optional): Notion API filter object to limit query results
Returns:  
- Promise resolving to an array with all pages matching the filter, handles pagination internally
Description:  
Retrieves all pages from a database matching the filter, iterating over all pages automatically.

`createPage(databaseId, properties)`  
Parameters:
- `databaseId` (string): The Notion database ID
- `properties` (object): Properties object following the Notion API format to set on the new page
Returns:  
- Promise resolving to the created page object
Description:  
Creates a new page in the specified database with the given property values.

`appendBlockChildren(blockId, children)`  
Parameters:  
`blockId (string)` — The ID of the parent block or page to append children to
`children` (Array<Object>) — Array of block objects created by block builder functions
Returns:  
- Promise resolving to the Notion API response containing the updated block children
Description:  
Appends an array of child blocks to a specified block or page by calling the Notion API PATCH endpoint
`/v1/blocks/{blockId}/children.`

---

### Block builder functions
All return objects formatted according to the Notion API specification to represent blocks:

`createParagraphBlock(text)`  
Creates a paragraph block with the provided string text.

`createHeadingBlock(text, level)`  
Creates a heading block at level 1, 2, or 3 with the given text.

`createToDoBlock(text, checked)`  
Creates a to-do (checkbox) block; checked is a boolean indicating if the box is checked.

`createBulletedListBlock(text)`  
Creates a bulleted list item block with the specified text.

---

## Notes
Make sure your token has the necessary permissions for the target database

This library does not use the official Notion SDK, only direct HTTP requests