---
sidebar_position: 3
id: query-database
title: queryDatabase
sidebar_label: queryDatabase
---

# queryDatabase

Executes a simple query on a Notion database and returns the **first page of matching results**.  
This is a lightweight version of `queryAllDatabase`, designed for quick lookups or previews.

## Parameters

| Name         | Type     | Description                                                  |
|--------------|----------|--------------------------------------------------------------|
| `databaseId` | `string` | The ID of the Notion database                                |
| `filter`     | `object` | _(optional)_ A simplified filter object (see syntax below)   |

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
const filter = {
  Status: 'In Progress',
  Estimate: { greater_than: 5 }
};

const result = await notion.queryDatabase('your-database-id', filter);
console.log(result.results);
```

## Returns
A Promise resolving to an object containing: Up to 100 matching pages

Metadata for pagination (e.g. has_more, next_cursor)

## Example Response
```json
{
  "object": "list",
  "results": [
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
        "Estimate": {
          "type": "number",
          "number": 8
        }
      },
      "url": "https://www.notion.so/Test-d3f9a2b71c5a4e8bb4569f0a12345678"
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```