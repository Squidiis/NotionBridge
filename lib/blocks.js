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


function createNumberedListBlock(text) {
	return {
		object: 'block',
		type: 'numbered_list_item',
		numbered_list_item: {
		rich_text: [
			{ type: 'text', text: { content: text } }
		]
		}
	};
}


function createToggleBlock(text, children = []) {
	return {
		object: 'block',
		type: 'toggle',
		toggle: {
		rich_text: [
			{ type: 'text', text: { content: text } }
		],
		children: children
		}
	};
}


function createDividerBlock() {
	return {
		object: 'block',
		type: 'divider',
		divider: {}
	};
}

function createCodeBlock(code, language = 'javascript') {
	return {
		object: 'block',
		type: 'code',
		code: {
		rich_text: [
			{ type: 'text', text: { content: code } }
		],
		language: language
		}
	};
}


function createImageBlock(imageUrl) {
	return {
		object: 'block',
		type: 'image',
		image: {
		type: 'external',
		external: {
			url: imageUrl
		}
		}
	};
}


function createCalloutBlock(text, icon = { type: 'emoji', emoji: '💡' }) {
	return {
		object: 'block',
		type: 'callout',
		callout: {
		rich_text: [
			{ type: 'text', text: { content: text } }
		],
		icon: icon
		}
	};
}


function createQuoteBlock(text) {
	return {
		object: 'block',
		type: 'quote',
		quote: {
		rich_text: [
			{ type: 'text', text: { content: text } }
		]
		}
	};
}


function createPageLinkBlock(pageId) {
  return {
    object: 'block',
    type: 'link_to_page',
    link_to_page: {
      type: 'page_id',
      page_id: pageId
    }
  };
}


export { 
	createParagraphBlock,
	createHeadingBlock, 
	createToDoBlock, 
	createBulletedListBlock, 
	createNumberedListBlock, 
	createToggleBlock, 
	createDividerBlock, 
	createCodeBlock, 
	createImageBlock,
	createCalloutBlock,
	createQuoteBlock,
	createPageLinkBlock
	}