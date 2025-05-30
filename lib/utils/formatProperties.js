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
