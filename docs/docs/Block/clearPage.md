---
sidebar_position: 4
id: clear-page
title: clearPage
sidebar_label: clearPage
---

# clearPage

Clears all child blocks from a Notion page or block, then returns the updated page or block object.

## Parameters

| Name      | Type     | Description                                                  |
|-----------|----------|--------------------------------------------------------------|
| `blockId` | `string` | ID of the page or block whose children should be removed     |

## Returns

A `Promise` that resolves to the updated page or block object after all children have been removed.

## Example

```js
const updatedBlock = await notion.clearPage("pageId_or_blockId");
console.log(updatedBlock);
```

This will delete all child blocks under the given page or block.

:::warning
This operation is destructive. All child content will be permanently removed and cannot be recovered.
:::

## Example Response

```json
{
  "object": "block",
  "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
  "parent": {
    "type": "database_id",
    "database_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
  },
  "created_time": "2025-05-31T15:24:00.000Z",
  "last_edited_time": "2025-06-09T16:55:00.000Z",
  "created_by": { "object": "user", "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "last_edited_by": { "object": "user", "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "has_children": false,
  "archived": false,
  "in_trash": false,
  "type": "child_page",
  "child_page": { "title": "Test" },
  "request_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
}
```