async function getDatabaseProperties(notionFetch, token, databaseId, options = {}) {

    const url = `https://api.notion.com/v1/databases/${databaseId}`;
    const data = await notionFetch(url, token);

    if (!data.properties || Object.keys(data.properties).length === 0) {
        throw new Error(`No properties found in database with ID "${databaseId}". Check if the ID is correct and the database has properties.`);
    }

    const allProps = data.properties;

    if (options.full) {

        const details = {};

        for (const [key, value] of Object.entries(allProps)) {
        const entry = { type: value.type };

            if (['select', 'status', 'multi_select'].includes(value.type) && value[value.type]?.options) {
                entry.options = value[value.type].options.map(opt => opt);
            }

            details[key] = entry;
        }

        return { details };

    }

    const simplified = {};

    for (const [key, value] of Object.entries(allProps)) {

        const entry = { type: value.type };

        if (['select', 'status', 'multi_select'].includes(value.type)) {
            entry.options = value[value.type]?.options.map(opt => opt.name) || [];
        }

        simplified[key] = entry;
    }

    return simplified;

}

export { getDatabaseProperties };