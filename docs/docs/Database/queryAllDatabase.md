---
sidebar_position: 4
id: query-all-database
title: queryAllDatabase
sidebar_label: queryAllDatabase
---

# queryAllDatabase

Queries an entire Notion database and retrieves **all matching pages**, handling pagination automatically.  
Supports simplified filter syntax that is internally converted to the Notion API's official format.

## Parameters

| Name           | Type       | Description                                                                 |
|----------------|------------|-----------------------------------------------------------------------------|
| `databaseId`   | `string`   | The ID of the Notion database                                               |
| `userFilter`   | `object`   | _(optional)_ Simple object describing property filters, see examples below |

## Simplified Filter Syntax

Instead of passing the full Notion API filter structure, you can provide an intuitive shorthand:

| Property Type       | Expected Input Format                                               | Explanation / Notes                                  |
|---------------------|-------------------------------------------------------------------|-----------------------------------------------------|
| `status` / `select` | string → `{ equals: "value" }`                                    | Filter by exact option name                          |
| `multi_select`      | string → `{ contains: "value" }`                                  | Filter if multi-select contains the given value     |
| `date`              | object → `{ equals / before / after / on_or_before / on_or_after / past_week / ... }` | Supports various date comparison operators          |
| `number`            | object → `{ equals / greater_than / less_than / ... }`            | Numeric comparisons with operators                   |
| `checkbox`          | boolean → `{ equals: true/false }`                                | True or false toggle filtering                        |
| `people` / `relation` | string → `{ contains: "user_id" or "page_id" }`                  | Checks if user or page ID is contained               |
| `title` / `rich_text` | string → `{ contains: "text" }`                                  | Text search in title or rich text properties          |

:::warning
If you reference a property that **does not exist** in the database schema, this function will throw an error like:
Error: Unknown property:
To avoid this, make sure all property names in your filter match exactly — including case, spaces, emojis, and special characters.
Use `getDatabaseProperties(databaseId)` to inspect all valid property keys before filtering:
```js
const schema = await notion.getDatabaseProperties(databaseId);
console.log(Object.keys(schema));
```
:::

## Example

```js
const userFilter = {
  Status: 'In Progress',
  Delivery: { before: '2025-06-30' },
  Estimate: { greater_than: 3 },
  Done: false
};

const result = await notion.queryAllDatabase('your-database-id', userFilter);
console.log(result);
```

## Returns

A `Promise` resolving to an array of Notion pages matching the filter.

Automatically handles pagination for large result sets.

## Example Response

```json
[
  {
    "object": "page",
    "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
    "properties": {
      "Status": {
        "type": "status",
        "status": {
          "name": "In Progress"
        }
      },
      "Delivery": {
        "type": "date",
        "date": {
          "start": "2025-06-15"
        }
      },
      "Estimate": {
        "type": "number",
        "number": 5
      }
    },
    "url": "https://www.notion.so/Test-d3f9a2b71c5a4e8bb4569f0a12345678"
  }
]
```