---
sidebar_position: 1
id: get-page
title: getPage
sidebar_label: getPage
---

# getPage

Retrieves the metadata and properties of a specific Notion page by its ID.

## Parameters

| Name     | Type     | Description                              |
|----------|----------|------------------------------------------|
| `pageId` | `string` | The ID of the Notion page to retrieve.  |

## Example

```js
const page = await notion.getPage('pageId');
console.log(page);
```

## Returns
A Promise resolving to the Notion page object with all metadata and properties.

## Example Response

```json
{
  "object": "page",
  "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
  "created_time": "2025-05-31T15:24:00.000Z",
  "last_edited_time": "2025-06-01T19:47:00.000Z",
  "created_by": { "object": "user", "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "last_edited_by": { "object": "user", "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "cover": null,
  "icon": null,
  "parent": {
    "type": "database_id",
    "database_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
  },
  "archived": false,
  "in_trash": false,
  "properties": {
    "Status": { "id": "VtRJ", "type": "status", "status": { /* ... */ } },
    "Name": { "id": "title", "type": "title", "title": [ /* ... */ ] }
  },
  "url": "https://www.notion.so/Test-d3f9a2b71c5a4e8bb4569f0a12345678",
  "public_url": null,
  "request_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
}
```