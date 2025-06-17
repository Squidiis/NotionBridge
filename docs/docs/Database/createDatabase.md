---
sidebar_position: 2
---

# createDatabase

Creates a new Notion database on a given parent page.

## Parameters

| Name           | Type     | Description                                                                                         |
|----------------|----------|-----------------------------------------------------------------------------------------------------|
| `parentPageId` | `string` | The ID of the parent page under which the database will be created                                 |
| `title`        | `string` | The name/title of the new database                                                                 |
| `properties`   | `object` | A simplified object defining the properties. Keys are property names, values define type & options |


## Example
```js
const newDatabase = await notion.createDatabase(
  "ID of the parent page",
  "Example", // Title of the new database
  {
    Name: { type: "title" }, // Title property
    Status: {
      type: "status",
      options: ["Open", "In Progress", "Done"] // Status options
    },
    Date: { type: "date" } // Due date
  }
);
```

## Supported Property Types

These types can be used directly in `createDatabase`.

| Type           | Input Format Example                  | Notes                              |
|----------------|------------------------------------|-----------------------------------|
| **title**        | `"Task Name"`                      | Unique per page                   |
| **rich_text**    | `"Some description"`               | Text with formatting              |
| **number**       | `42`                              | Supports numeric comparisons      |
| **select**       | `"Option Name"`                   | Must match existing option names  |
| **multi_select** | `["Tag1", "Tag2"]`                | Multiple options allowed          |
| **status**       | `"In Progress"`                   | Similar to select but for workflow|
| **date**         | `"2025-06-01"` or `{ start: "2025-06-01", end: "2025-06-07" }` | Supports single date or ranges   |
| **checkbox**     | `true` or `false`                 | Boolean                         |
| **url**          | `"https://example.com"`           | Valid URL string                |
| **email**        | `"user@example.com"`              | Valid email format              |
| **phone_number** | `"+1234567890"`                   | International format recommended |
| **people**       | `"user-id"` or `["id1", "id2"]`  | User IDs from workspace        |
| **relation**     | `["page-id-1", "page-id-2"]`     | Links to pages in another DB    |

:::note node
The `relation` property requires an additional field `database_id`, e.g.:

```js
RelatedProjects: {
  type: "relation",
  database_id: "abc123xyz"
}
```
:::

## Returns

A `Promise` resolving to the created Notion database object.

If `options` includes complex property types (e.g., status/select), Notion will auto-generate property IDs and return metadata including IDs, URLs, parent info, etc.

## Example Response

```json
{
  "object": "database",
  "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
  "cover": null,
  "icon": null,
  "created_time": "2025-06-08T09:32:00.000Z",
  "created_by": { "object": "user", "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "last_edited_by": { "object": "user", "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "last_edited_time": "2025-06-08T09:32:00.000Z",
  "title": [
    {
      "type": "text",
      "text": ["Object"],
      "annotations": ["Object"],
      "plain_text": "Example",
      "href": null
    }
  ],
  "description": [],
  "is_inline": false,
  "properties": {
    "Date": { "id": "J%5B%3Fd", "name": "Date", "type": "date", "date": {} },
    "Name": { "id": "title", "name": "Name", "type": "title", "title": {} }
  },
  "parent": { "type": "page_id", "page_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678" },
  "url": "https://www.notion.so/d3f9a2b71c5a4e8bb4569f0a12345678",
  "public_url": null,
  "archived": false,
  "in_trash": false,
  "request_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
}
```