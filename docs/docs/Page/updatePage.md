---
sidebar_position: 4
id: update-page
title: updatePage
sidebar_label: updatePage
---

# updatePage

Updates a Notion page’s metadata and properties, including properties, icon, cover, and archived status.

## Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| `pageId`    | `string` | The ID of the Notion page to update.                                       |
| `update`    | `object` | Object containing the values to update. Possible keys include:             |
|             |          | - `properties`: Object of property values to update (e.g. `{ Name: "..." }`) |
|             |          | - `icon`: Emoji string, image URL, or Notion icon object                  |
|             |          | - `cover`: External image URL to set as cover                             |
|             |          | - `archived`: `true` or `false` to archive/unarchive the page             |

## Example

```js
const result = await notion.updatePage('pageId', {
  properties: {
    Status: "Done",
    Name: "Updated Task Title"
  },
  icon: "✅",
  cover: "html://...",
  archived: false
});
console.log(result);
```

## Returns

A Promise resolving to the updated Notion page object.

:::warning
Make sure the provided property names exactly match the database schema.
If you try to use a property that doesn't exist, the API call will fail.
Use getDatabaseProperties to inspect the available properties before updaiting a page.
:::

## Example Response

```json
{
  "object": "page",
  "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
  "created_time": "2025-05-31T15:24:00.000Z",
  "last_edited_time": "2025-06-09T16:55:00.000Z",
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
    "Status": { "id": "VtRJ", "type": "status", "status": "[Object]" },
  },
  "url": "https://www.notion.so/Test-d3f9a2b71c5a4e8bb459f0a12345678",
  "public_url": null,
  "request_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
}
```
