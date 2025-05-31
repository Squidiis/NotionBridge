/**
 * Formats user input properties according to the Notion schema for updating or creating pages.
 *
 * @param {Object} userInput - User-provided key-value pairs for page properties (e.g., { Name: "Task 1", Status: "Done" })
 * @param {Object} schema - Notion database schema defining property types (e.g., { Name: { type: "title" }, Status: { type: "select" } })
 * @returns {Object} Formatted properties object compatible with Notion API (e.g., { Name: { title: [...] }, Status: { select: {...} } })
 *
 * Supports property types:
 * - title, rich_text: formatted as text content arrays
 * - select, status: formatted as named options
 * - multi_select: formatted as arrays of named options
 * - people: formatted as arrays of user ID objects
 *
 * Logs a warning for unsupported property types.
 */
function formatProperties(userInput, schema) {
  	const formatted = {};

  	for (const [key, value] of Object.entries(userInput)) {

    	const prop = schema[key];
    	
		if (!prop) continue;

    	switch (prop.type) {

			case 'title':
				formatted[key] = {
				title: [{ text: { content: value } }]
				};
				break;

			case 'rich_text':
				formatted[key] = {
				rich_text: [{ text: { content: value } }]
				};
				break;

			case 'select':
				formatted[key] = {
				select: { name: value }
				};
				break;

			case 'status':
				formatted[key] = {
				status: { name: value }
				};
				break;

			case 'multi_select':
				formatted[key] = {
				multi_select: value.map(v => ({ name: v }))
				};
				break;

			case 'people':
				if (Array.isArray(value)) {
					formatted[key] = {
					people: value.map(id => ({ id }))
					};
				} else {
					formatted[key] = {
					people: [{ id: value }]
					};
				}
				break;

      	default:
        	console.warn(`⚠️ Property type not supported yet: "${key}" (${prop.type})`);
    	}
  	}

  	return formatted;
}


export { formatProperties };
