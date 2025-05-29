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



export { formatProperties, formatFilter };
