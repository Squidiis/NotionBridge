/**
 * Formats a simplified filter object into a Notion-compatible filter structure,
 * based on the property's type from the given schema.
 *
 * This is useful for transforming user-friendly input like:
 * `{ Status: "Open" }`
 * into the required Notion API filter format.
 *
 * @param {Object} userInput - A simplified filter object, e.g. `{ Status: "Done" }`
 * @param {Object} schema - The Notion database property schema (retrieved via getDatabaseProperties)
 * @returns {Object} A formatted Notion filter object suitable for querying
 * @throws Will throw an error if the property does not exist in the schema
 *         or if the property type is not supported
 * @example
 * const userInput = { Status: "In Progress" };
 * const schema = await notion.getDatabaseProperties(databaseId);
 * const filter = formatFilter(userInput, schema);
 */
function formatFilter(userInput, schema) {

	const [key, value] = Object.entries(userInput)[0];
	const prop = schema[key];

	if (!prop) {
		throw new Error(`Unknown property: "${key}"`);
	}

	const type = prop.type;

	switch (type) {
		case 'select':
		case 'status':
		return {
			property: key,
			[type]: { equals: value }
		};

		case 'multi_select':
		return {
			property: key,
			[type]: { contains: value }
		};

		case 'title':
		case 'rich_text':
		return {
			property: key,
			[type]: { contains: value }
		};

		case 'date':
		return {
			property: key,
			date: { equals: value } // before, after, etc.
		};

		case 'number':
		return {
			property: key,
			number: { equals: value } // or greater_than, less_than etc.
		};

		case 'checkbox':
		return {
			property: key,
			checkbox: { equals: value } // true/false
		};

		case 'people':
		return {
			property: key,
			people: { contains: value } // value is user_id
		};

		case 'relation':
		return {
			property: key,
			relation: { contains: value } // value is page_id
		};

		default:
		throw new Error(`Filter type "${type}" not supported (yet)`);
	}
}


export { formatFilter }