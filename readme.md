# NotionBridge

**A minimal Notion API wrapper without SDK**  
(Currently still under development)
Docs: https://squidiis.github.io/NotionBridge-docs/#intro

---

## Features

- Retrieve database properties with optional detailed options  
- Query databases with filters  
- Query **all** database entries with automatic pagination  
- Create new pages in a database  
- Create new databases with simple property definitions  
- Append child blocks to any block or page  
- Easily create various block types:
  - Paragraph, headings, to-dos, bulleted lists, numbered lists  
  - Toggles with nested children  
  - Code blocks with language support  
  - Dividers, quotes, callouts  
  - Images via public URLs  
  - Page links to existing Notion pages  
- Archive pages by setting their archived status  
- Update properties of existing pages  
- Update page metadata including properties, icon, cover, archived status, and parent  
- Retrieve child blocks of a page or block  
- Clear all child blocks from a page or block  
- Delete individual blocks  
- Uses simple fetch requests with your Notion integration token  
- Lightweight and flexible — zero external dependencies  

---

## Installation

```bash
npm install git+https://github.com/Squidiis/NotionBridge.git
```

## Usage

```js
import { getDatabaseProperties } from 'notionbridge';

// Initialize your client with your Notion API token
const notion = notionbridge('your-integration-token');

// Example: Get database properties
async function example() {

  	const dbProperties = await notion.getDatabaseProperties('Database-id', { full: false });
	console.log('Existing database properties:', dbProperties);

	// 2. Create a new database on a specific parent page
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
	console.log('New database created:', newDatabase);

	// 3. Define content blocks to add to the new page
	const blockChildren = [
		notion.createQuoteBlock('test quote'),      // Quote block
		notion.createDividerBlock(),                // Divider block
		notion.createParagraphBlock('test space')   // Paragraph block
	];

	// 4. Define the property values for the new page
	const newPageProperties = {
		Status: 'Offen', // Status value
		Name: 'Test'     // Title value
	};

	// 5. Create a new page (entry) in the newly created database
	const newPage = await notion.createPage(newDatabase.id, newPageProperties);
	console.log('New page created:', newPage);

	// 6. Append the content blocks to the new page
	await notion.appendBlockChildren(newPage.id, blockChildren);
	console.log('Blocks appended to new page');

}

example();
```

## Notes
Make sure your token has the necessary permissions for the target database

This library does not use the official Notion SDK, only direct HTTP requests
