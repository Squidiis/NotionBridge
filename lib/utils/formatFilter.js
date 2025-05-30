
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