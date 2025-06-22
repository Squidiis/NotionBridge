
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
      if (Array.isArray(notionResponse.results)) {
        return notionResponse.results.map(mapResponse);
      }
      return notionResponse;
    default:
      return notionResponse;
  }
}

function mapPage(page) {
  if (!page || !page.properties) return page;

  const mapped = {
    id: page.id,
    url: page.url,
  };

  for (const [key, prop] of Object.entries(page.properties)) {
    mapped[key] = extractPropertyValue(prop);
  }

  return mapped;
}

function mapDatabase(db) {
  const mapped = {
    id: db.id,
    title: extractTitle(db.title),
    properties: {}
  };

  if (db.properties) {
    for (const [key, prop] of Object.entries(db.properties)) {
      mapped.properties[key] = {
        id: prop.id,
        type: prop.type
      };
    }
  }

  return mapped;
}

function mapBlock(block) {
  if (!block || typeof block !== 'object') return null;

  const mapped = {
    id: block.id,
    type: block.type,
    has_children: block.has_children || false,
    children: [],
  };

  const content = block[block.type] || {};

  if (content.text) {
    mapped.text = content.text.map(t => t.plain_text ?? t.text?.content ?? '').join('');
  }

  if (content.rich_text) {
    mapped.text = content.rich_text.map(t => t.plain_text ?? t.text?.content ?? '').join('');
  }

  switch (block.type) {
    case 'to_do':
    case 'checkbox':
      mapped.checked = content.checked ?? false;
      break;

    case 'image':
    case 'video':
    case 'file':
    case 'pdf':
      mapped.url = content.file?.url || content.external?.url || null;
      mapped.caption = (content.caption || []).map(t => t.plain_text ?? '').join('');
      break;

    case 'bookmark':
    case 'embed':
    case 'link_preview':
    case 'link_to_page':
      mapped.url = content.url ?? null;
      break;

    case 'equation':
      mapped.expression = content.expression ?? '';
      break;

    case 'code':
      mapped.language = content.language;
      mapped.code = content.rich_text.map(t => t.plain_text ?? '').join('');
      break;

    case 'callout':
    case 'quote':
    case 'paragraph':
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'toggle':
    case 'table_row':
      mapped.text = content.rich_text?.map(t => t.plain_text ?? '').join('') || '';
      break;

    case 'divider':
      break;

    default:
      mapped.raw = content;
  }

  if (block.children && Array.isArray(block.children)) {
    mapped.children = block.children.map(mapBlock);
  }

  return mapped;
}

function extractPropertyValue(prop) {
  if (!prop || typeof prop !== 'object') return null;

  switch (prop.type) {
    case 'title':
      return prop.title.map(t => t.text?.content ?? '').join('');

    case 'rich_text':
      return prop.rich_text.map(t => t.text?.content ?? '').join('');

    case 'select':
      return prop.select ? prop.select.name : null;

    case 'multi_select':
      return prop.multi_select ? prop.multi_select.map(s => s.name) : [];

    case 'status':
      return prop.status ? prop.status.name : null;

    case 'date':
      return prop.date?.start ?? null;

    case 'checkbox':
      return prop.checkbox;

    case 'number':
      return prop.number;

    case 'url':
      return prop.url;

    case 'email':
      return prop.email;

    case 'phone_number':
      return prop.phone_number;

    case 'people':
      return prop.people ? prop.people.map(p => p.id) : [];

    case 'relation':
      return prop.relation ? prop.relation.map(r => r.id) : [];

    case 'formula':
      const f = prop.formula;
      return f.string ?? f.number ?? f.boolean ?? null;

    case 'rollup':
      return prop.rollup?.array ?? prop.rollup?.number ?? prop.rollup?.date ?? null;

    case 'created_time':
      return prop.created_time;

    case 'last_edited_time':
      return prop.last_edited_time;

    case 'created_by':
    case 'last_edited_by':
      return prop[prop.type]?.id ?? null;

    default:
      return null;
  }
}

function extractTitle(titleArray) {
  if (!Array.isArray(titleArray)) return '';
  return titleArray.map(t => t.plain_text || t.text?.content || '').join('');
}

export { mapResponse };
