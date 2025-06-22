
function mapResponse(notionResponse) {
  if (!notionResponse) return null;

  switch (notionResponse.object) {
    case 'page':
      return mapPage(notionResponse);
    case 'database':
      return mapDatabase(notionResponse);
    case 'block':
      return mapBlock(notionResponse);
    case 'list':
      return Array.isArray(notionResponse.results)
        ? notionResponse.results.map(mapResponse)
        : notionResponse;
    default:
      return notionResponse;
  }
}


function mapPage(page) {
  if (!page.properties) return page;

  const mapped = { id: page.id };

  for (const [key, prop] of Object.entries(page.properties)) {
    mapped[key] = extractPropertyValue(prop);
  }

  return mapped;
}


function mapDatabase(db) {
  const mapped = {
    id: db.id,
    title: extractTitle(db.title),
    properties: {},
  };

  if (db.properties) {
    for (const [key, prop] of Object.entries(db.properties)) {
      mapped.properties[key] = {
        id: prop.id,
        type: prop.type,
      };
    }
  }

  return mapped;
}

function mapBlock(block) {
  const { id, type, has_children } = block;
  const content = block[type] || {};

  const mapped = {
    id,
    type,
    has_children,
    children: [],
    text: extractRichText(content?.text || content?.rich_text || []),
  };

  if (type === 'to_do') {
    mapped.checked = content?.checked ?? false;
  }

  if (has_children && Array.isArray(block.children)) {
    mapped.children = block.children.map(mapBlock);
  }

  return mapped;
}

function extractPropertyValue(prop) {
  switch (prop.type) {
    case 'title':
      return prop.title.map(t => t.text.content).join('');
    case 'rich_text':
      return prop.rich_text.map(t => t.text.content).join('');
    case 'number':
      return prop.number;
    case 'select':
      return prop.select ? prop.select.name : null;
    case 'multi_select':
      return Array.isArray(prop.multi_select) ? prop.multi_select.map(s => s.name) : [];
    case 'date':
      return prop.date ? { start: prop.date.start, end: prop.date.end || null } : null;
    case 'people':
      return Array.isArray(prop.people)
        ? prop.people.map(p => ({ id: p.id, name: p.name || null }))
        : [];
    case 'files':
      return Array.isArray(prop.files)
        ? prop.files.map(f => ({
            name: f.name || null,
            url: f.file?.url || f.external?.url || null,
          }))
        : [];
    case 'checkbox':
      return prop.checkbox;
    case 'url':
      return prop.url;
    case 'email':
      return prop.email;
    case 'phone_number':
      return prop.phone_number;
    case 'formula':
      if (prop.formula) {
        return prop.formula.string ?? prop.formula.number ?? prop.formula.boolean ?? null;
      }
      return null;
    case 'relation':
      return Array.isArray(prop.relation)
        ? prop.relation.map(r => ({ id: r.id }))
        : [];
    case 'rollup':
      if (!prop.rollup) return null;
      switch (prop.rollup.type) {
        case 'number':
          return prop.rollup.number;
        case 'date':
          return prop.rollup.date ? { start: prop.rollup.date.start, end: prop.rollup.date.end || null } : null;
        case 'array':
          if (Array.isArray(prop.rollup.array)) {
            return prop.rollup.array.map(item => {
              if (item.type === 'title') {
                return item.title.map(t => t.text.content).join('');
              }
              return item;
            });
          }
          return [];
        case 'string':
          return prop.rollup.string;
        case 'boolean':
          return prop.rollup.boolean;
        default:
          return null;
      }
    case 'created_time':
      return prop.created_time;
    case 'created_by':
      return prop.created_by ? { id: prop.created_by.id, name: prop.created_by.name || null } : null;
    case 'last_edited_time':
      return prop.last_edited_time;
    case 'last_edited_by':
      return prop.last_edited_by ? { id: prop.last_edited_by.id, name: prop.last_edited_by.name || null } : null;
    case 'status':
      return prop.status ? prop.status.name : null;
    default:
      return null;
  }
}

function extractRichText(textArray) {
  if (!Array.isArray(textArray)) return '';
  return textArray.map(t => t.plain_text ?? t.text?.content ?? '').join('');
}

function extractTitle(titleArray) {
  return extractRichText(titleArray);
}

export { mapResponse };
