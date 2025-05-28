

async function getDatabaseProperties(databaseId, token, options = {}) {


    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: 'GET', headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
        }
    });

    if (!res.ok) {
        console.log('Fehler:', res.status, await res.text());
        return;
    }
    
    const data = await res.json();
    const allProps = data.properties;

    if (options.full) {

    const details = {};
    for (const [key, value] of Object.entries(allProps)) {

        const entry = {
        type: value.type
        };

        if (value.type === 'select' || value.type === 'status' || value.type === 'multi_select') {
            if (value[value.type] && value[value.type].options) {
                entry.options = value[value.type].options.map(opt => opt.name);
            }
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
