---
sidebar_position: 2
id: create-page
title: createPage
sidebar_label: createPage
---

# createPage

Creates a new page in the specified Notion database using simplified property input.

## Parameters

| Name         | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| `databaseId` | `string` | The ID of the Notion database where the page will be created.              |
| `properties` | `object` | A simplified key-value object of property names and their values.           |

## Example

```js
const newPage = await notion.createPage('databaseId', {
  Status: 'Open',
  Name: 'New-Page'
});
console.log(newPage);
```

## Supported Property Types for `formatProperties`

| Property Type   | Input Format Example             | Output Format Example                                                    | Notes                              |
|-----------------|---------------------------------|-------------------------------------------------------------------------|----------------------------------|
| `title`       | `"Task Name"`                   | `{ title: [{ text: { content: "Task Name" } }] }`                      | Main title property               |
| `rich_text`   | `"Some description"`            | `{ rich_text: [{ text: { content: "Some description" } }] }`            | Text with formatting              |
| `select`      | `"Option Name"`                 | `{ select: { name: "Option Name" } }`                                  | Single select option              |
| `status`      | `"In Progress"`                 | `{ status: { name: "In Progress" } }`                                  | Status property like select       |
| `multi_select`| `["Tag1", "Tag2"]`              | `{ multi_select: [{ name: "Tag1" }, { name: "Tag2" }] }`                | Multiple select options           |
| `people`      | `"user_id"` or `["id1", "id2"]`| `{ people: [{ id: "user_id" }] }` or `{ people: [{ id: "id1" }, { id: "id2" }] }` | User(s) assigned to property      |
| `url`         | `"https://example.com"`         | `{ url: "https://example.com" }`                                       | URL property                     |
| `email`       | `"user@example.com"`            | `{ email: "user@example.com" }`                                        | Email address                   |
| `phone_number`| `"+1234567890"`                 | `{ phone_number: "+1234567890" }`                                     | Phone number                    |

### Example usage for `userInput`:

```js
const userInput = {
  Name: "My Task",
  Status: "In Progress",
  Tags: ["urgent", "frontend"],
  Assigned: ["user-id-123"],
  Website: "https://example.com",
  ContactEmail: "contact@example.com",
  Phone: "+1234567890"
};
```

## Returns

A Promise resolving to the newly created page object returned by the Notion API.

:::warning
Make sure the provided property names exactly match the database schema.
If you try to use a property that doesn't exist, the API call will fail.
Use getDatabaseProperties to inspect the available properties before creating a new page.
:::

## Example Response

```json
{
  "object": "page",
  "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
  "created_time": "2025-06-08T18:51:00.000Z",
  "last_edited_time": "2025-06-08T18:51:00.000Z",
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
    "Status": { "id": "VtRJ", "type": "status", "status": { "name": "Open", "color": "default", "id": "abc123" } },
    "Name": {
      "id": "title",
      "type": "title",
      "title": [
        {
          "type": "text",
          "text": { "content": "Test", "link": null },
          "plain_text": "Test"
        }
      ]
    }
  },
  "url": "https://www.notion.so/Test-d3f9a2b71c5a4e8bb4569f0a12345678",
  "public_url": null
}
```