---
sidebar_position: 1
id: get-database-properties
title: getDatabaseProperties
sidebar_label: getDatabaseProperties
---

# getDatabaseProperties

Fetches the properties of a Notion database by ID.

## Parameters

| Name         | Type     | Description                                                                            |
|--------------|----------|----------------------------------------------------------------------------------------|
| `databaseId` | `string` | The Notion database ID                                                                |
| `options`    | `object` | _(optional)_ Options object, e.g. `{ full: true }` to return detailed property options |

## Example

```js
const result = await notion.getDatabaseProperties('ID of the Database', { full:false })
```

## Returns

A `Promise` resolving to an object with the database's properties.

If `options.full` is `true`, option lists include additional metadata (like `id`, `color`, and `description`).

## Example Response

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="response-mode"> <TabItem value="compact" label="Full: false">

```json
{
  "Status": {
    "type": "status",
    "options": ["To Do", "In Progress", "Done"]
  },
  "Priority": {
    "type": "select",
    "options": ["Low", "Medium", "High"]
  },
  "Due Date": { "type": "date" },
  "Assignee": { "type": "people" },
  "Name": { "type": "title" }
}
```
</TabItem> <TabItem value="detailed" label="Full: true">

```json
{
  "details": {
    "Status": {
      "type": "status",
      "options": [
        { "id": "a1", "name": "To Do", "color": "red", "description": null },
        { "id": "a2", "name": "In Progress", "color": "yellow", "description": null },
        { "id": "a3", "name": "Done", "color": "green", "description": null }
      ]
    },
    "Priority": {
      "type": "select",
      "options": [
        { "id": "p1", "name": "Low", "color": "blue", "description": null },
        { "id": "p2", "name": "Medium", "color": "orange", "description": null },
        { "id": "p3", "name": "High", "color": "red", "description": null }
      ]
    },
    "Due Date": { "type": "date" },
    "Assignee": { "type": "people" },
    "Name": { "type": "title" }
  }
}
```
</TabItem> </Tabs>