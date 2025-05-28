async function getDatabaseProperties(notionFetch, token, databaseId, options = {}) {

    const url = `https://api.notion.com/v1/databases/${databaseId}`;
    const data = await notionFetch(url, token);

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
        simplified[key] = value.type;
    }
    return simplified;
}

export { getDatabaseProperties };