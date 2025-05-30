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

      default:
        throw new Error(`⚠️ Property type not supported yet: ${prop.type}`);

    }
  }

  return result;
}


export { normalizeProperties }