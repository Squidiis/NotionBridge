---
sidebar_position: 3
id: delete-block
title: deleteBlock
sidebar_label: deleteBlock
---

# deleteBlock

Deletes a block by removing it from the page.

## Parameters

| Name       | Type     | Description                       |
|------------|----------|-----------------------------------|
| `blockId`  | `string` | ID of the block to be deleted     |

## Returns

A `Promise` that resolves to the API response object.

## Example

```js
const result = await notion.deleteBlock("block-id");
console.log(result);
```

:::note
This will remove the specified block from the page. The block is marked as archived in Notion’s backend.

This does not permanently delete the block from the system — it is archived and no longer rendered.
:::

## Example Response

```json
{
  "object": "block",
  "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
  "archived": true,
  "in_trash": true,
  "type": "quote",
  "quote": {
    "rich_text": [
      {
        "type": "text",
        "text": {
          "content": "This is a quote"
        }
      }
    ],
    "color": "default"
  }
}
```