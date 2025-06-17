---
sidebar_position: 2
id: append-block-children
title: appendBlockChildren
sidebar_label: appendBlockChildren
---

# appendBlockChildren

Appends child blocks to a specified block or page using the Notion API.

## Parameters

| Name        | Type            | Description                                                        |
|-------------|-----------------|--------------------------------------------------------------------|
| `blockId`   | `string`        | ID of the parent block or page to append children to               |
| `children`  | `Array<Object>` | Array of Notion block objects created by block builder functions   |

## Returns

A `Promise` that resolves to the updated block object containing the new children.

## Usage with Block Builder Functions

These helper functions can be used to generate valid block objects:

- `createParagraphBlock(text)`
- `createHeadingBlock(text, level)`
- `createToDoBlock(text, checked)`
- `createBulletedListBlock(text)`
- `createNumberedListBlock(text)`
- `createToggleBlock(text, children)`
- `createDividerBlock()`
- `createCodeBlock(code, language)`
- `createImageBlock(imageUrl)`
- `createCalloutBlock(text, icon)`
- `createQuoteBlock(text)`
- `createPageLinkBlock(pageId)`

## Example

```js
const blocks = [
  notion.createHeadingBlock("Project Overview", 2),
  notion.createParagraphBlock("This is the introduction."),
  notion.createToDoBlock("Write documentation", true),
  notion.createBulletedListBlock("First bullet"),
  notion.createNumberedListBlock("Step one"),
  notion.createCodeBlock("console.log('Hello, world!');", "javascript"),
  notion.createImageBlock("https://example.com/image.png"),
  notion.createCalloutBlock("Don't forget to hydrate!", "💧"),
  notion.createQuoteBlock("Simplicity is the ultimate sophistication."),
  notion.createDividerBlock(),
];

await notion.appendBlockChildren("parentBlockId", blocks);
```

## Notes

- The `blockId` must refer to a block type that supports children (e.g., pages, toggles).

- `children` must be an array of valid Notion block objects.

This operation is additive. Existing children will remain intact unless explicitly removed by another operation.

## Example Response

```json
{
  "object": "list",
  "results": [
    {
      "object": "block",
      "id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678",
      "parent": {
        "type": "block_id",
        "block_id": "some-parent-id"
      },
      "created_time": "2025-06-10T16:30:00.000Z",
      "last_edited_time": "2025-06-10T16:30:00.000Z",
      "created_by": {
        "object": "user",
        "id": "user-id"
      },
      "last_edited_by": {
        "object": "user",
        "id": "user-id"
      },
      "has_children": false,
      "archived": false,
      "in_trash": false,
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "This is a new paragraph.",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "This is a new paragraph.",
            "href": null
          }
        ],
        "color": "default"
      }
    }
  ],
  "next_cursor": null,
  "has_more": false,
  "type": "block",
  "block": {},
  "request_id": "d3f9a2b7-1c5a-4e8b-b456-9f0a12345678"
}
```