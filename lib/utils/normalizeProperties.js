/**
 * Normalizes a simplified property definition object into the full Notion API property format.
 * Used when creating a new database to define its properties.
 * 
 * @param {Object} properties - Object with keys as property names and values as simplified property descriptors.
 *                              Example: { Name: { type: "title" }, Status: { type: "status", options: ["Open", "Done"] } }
 * @returns {Object} Normalized properties object in the structure required by Notion API.
 * @throws {Error} Throws if an unsupported property type is encountered.
 * @example
 * normalizeProperties({
 *   Name: { type: "title" },
 *   Status: { type: "status", options: ["Open", "Done"] }
 * });
 */
function normalizeProperties(properties) {
  const result = {};

  for (const [name, prop] of Object.entries(properties)) {
    switch (prop.type) {
      case "title":
        result[name] = { title: {} };
        break;
      case "rich_text":
        result[name] = { rich_text: {} };
        break;
      case "number":
        result[name] = { number: {} };
        break;
      case "select":
        result[name] = { select: { options: prop.options || [] } };
        break;
      case "multi_select":
        result[name] = { multi_select: { options: prop.options || [] } };
        break;
      case "date":
        result[name] = { date: {} };
        break;
      case "checkbox":
        result[name] = { checkbox: {} };
        break;
      case "url":
        result[name] = { url: {} };
        break;
      case "email":
        result[name] = { email: {} };
        break;
      case "phone_number":
        result[name] = { phone_number: {} };
        break;
      case "status":
        result[name] = { status: {} };
        break;
      case "people":
        result[name] = { people: {} };
        break;
      case "relation":
        if (!prop.relation?.database_id) {
          throw new Error(`Property "${name}" of type "relation" requires a "database_id" property.`);
        }
        result[name] = {
          relation: {
            database_id: prop.relation.database_id,
            single_property: {}
          }
        };
        break;

      default:
        throw new Error(`⚠️ Property type not supported yet: ${prop.type}`);
    }
  }

  return result;
}

export { normalizeProperties }
