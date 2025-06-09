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
  
  const filters = Object.entries(userInput).map(([key, value]) => {
    const prop = schema[key];

    if (!prop) {
      throw new Error(`Unknown property: "${key}"`);
    }

    const type = prop.type;

    const buildCondition = (filterType, opKey, opVal) => ({
      property: key,
      [filterType]: { [opKey]: opVal }
    });

    switch (type) {
      case 'select':
      case 'status':
        return buildCondition(type, 'equals', value);

      case 'multi_select':
        return buildCondition(type, 'contains', value);

      case 'title':
      case 'rich_text':
        return buildCondition(type, 'contains', value);

      case 'checkbox':
        return buildCondition(type, 'equals', value);

      case 'number':
        if (typeof value === 'object' && value !== null) {
          const [op, opVal] = Object.entries(value)[0];
          return buildCondition('number', op, opVal);
        }
        return buildCondition('number', 'equals', value);

      case 'date':
        if (typeof value === 'object' && value !== null) {
          const [op, opVal] = Object.entries(value)[0];
          return buildCondition('date', op, opVal);
        }
        return buildCondition('date', 'equals', value);

      case 'people':
        return buildCondition('people', 'contains', value);

      case 'relation':
        return buildCondition('relation', 'contains', value);

      default:
        throw new Error(`Filter type "${type}" for property "${key}" is not supported.`);
    }
  });

  return filters.length === 1 ? filters[0] : { and: filters };
}


export { formatFilter }