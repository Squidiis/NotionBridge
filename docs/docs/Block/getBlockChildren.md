---
sidebar_position: 1
id: get-block-children
title: getBlockChildren
sidebar_label: getBlockChildren
---

# getBlockChildren

Retrieves the child blocks of a Notion block or page.  
Optionally supports automatic pagination to fetch all children across multiple pages.

## Parameters

| Name        | Type            | Default | Description                                                                 |
|-------------|-----------------|---------|-----------------------------------------------------------------------------|
| `blockId`   | `string`        | —       | The ID of the page or block to retrieve children from.                     |
| `pageSize`  | `number`        | `100`   | Number of children to fetch per request (max 100).                         |
| `getAll`    | `boolean`       | `false` | If `true`, retrieves **all** children by following the `next_cursor`.     |

## Returns

If `getAll` is `false`, returns the raw Notion API response object containing a single page of results (with `next_cursor`, etc.).

If `getAll` is `true`, returns:
```js
{
  results: Array<Object>
}
```

### Example (Get a single page of children)
```js
const result = await getBlockChildren("blockId");
console.log(result.results);
```

### Example (Get all children across pages)

```js
const result = await getBlockChildren("blockId", 100, true);
console.log(result.results.length); // All children
```

If you expect many blocks, use getAll: true to make sure you retrieve everything.

:::note
The Notion API returns a maximum of 100 results per request. Use getAll to handle pagination automatically.

Children can include various block types (paragraphs, headings, toggles, etc.).
:::

## Example Response

```json
{
  "results": [
    {
      "object": "block",
      "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
      "type": "divider",
      "divider": {}
    },
    {
      "object": "block",
      "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "Example paragraph"
            }
          }
        ]
      }
    }
  ]
}
```