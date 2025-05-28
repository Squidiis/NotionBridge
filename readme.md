# notionbridge

**A minimal Notion API wrapper without SDK**  
(Currently still under development)

---

## Features

- Retrieve database properties with optional detailed options  
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

`getDatabaseProperties(notionFetch, token, databaseId, options)`
- `notionFetch`: A function that performs the fetch request
- `token`: Your Notion API token (string)
- `databaseId`: The ID of the Notion database (string)
- `options (optional):` Object containing options
    - `full`: true returns detailed properties including options lists

## Notes
Make sure your token has the necessary permissions for the target database

This library does not use the official Notion SDK, only direct HTTP requests