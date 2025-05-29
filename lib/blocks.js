function createParagraphBlock(text) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        { type: 'text', text: { content: text } }
      ]
    }
  };
}


function createHeadingBlock(text, level = 1) {
  const headingType = `heading_${level}`;
  return {
    object: 'block',
    type: headingType,
    [headingType]: {
      rich_text: [
        { type: 'text', text: { content: text } }
      ]
    }
  };
}

function createToDoBlock(text, checked = false) {
  return {
    object: 'block',
    type: 'to_do',
    to_do: {
      rich_text: [
        { type: 'text', text: { content: text } }
      ],
      checked: checked
    }
  };
}

function createBulletedListBlock(text) {
  return {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        { type: 'text', text: { content: text } }
      ]
    }
  };
}


export { createParagraphBlock, createHeadingBlock, createToDoBlock, createBulletedListBlock }