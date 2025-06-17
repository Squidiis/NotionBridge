---
sidebar_position: 3
id: archive-page
title: archivePage
sidebar_label: archivePage
---

# archivePage

Archives an existing Notion page by setting the `archived` property to `true`.

## Parameters

| Name      | Type     | Description                           |
|-----------|----------|---------------------------------------|
| `pageId`  | `string` | The ID of the Notion page to archive. |

## Example

```js
const result = await notion.archivePage('pageId');
console.log(result);
```

## Returns

A Promise resolving to the updated page object with `archived: true`

:::tip
You can unarchive a page later by updating it with `archived: false` using `updatePage`.
:::

## Example Response

```json
{
  "object": "page",
  "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
  "created_time": "2025-05-31T15:24:00.000Z",
  "last_edited_time": "2025-06-09T16:41:00.000Z",
  "created_by": { "object": "user", "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "last_edited_by": { "object": "user", "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "cover": null,
  "icon": null,
  "parent": {
    "type": "database_id",
    "database_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
  },
  "archived": true,
  "in_trash": false,
  "properties": {
    "Status": { "id": "VtRJ", "type": "status", "status": "[Object]" },
  },
  "url": "https://www.notion.so/Test-d3f9a2b71c5a4e8bb4569f0a12345678",
  "public_url": null,
  "request_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
}
```