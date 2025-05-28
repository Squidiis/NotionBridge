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

// Your custom fetch function to call Notion API
async function notionFetch(url, token) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return await res.json();
}

// Example usage
const token = 'your-integration-token';
const databaseId = 'your-database-id';

getDatabaseProperties(notionFetch, token, databaseId, { full: true })
  .then(data => console.log(data))
  .catch(err => console.error(err));
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