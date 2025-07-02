import { languageMap } from './utils/languageMap.js';

function richTextFromMarkdown(text) {

  // Detects bold, italic, code, links
  const richTexts = [];
  let match;
  let lastIndex = 0;
  const regex = /(\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      richTexts.push({ type: 'text', text: { content: text.slice(lastIndex, match.index) } });
    }
    if (match[2] || match[3]) { // bold
      richTexts.push({ type: 'text', text: { content: match[2] || match[3] }, annotations: { bold: true } });
    } else if (match[4] || match[5]) { // italic
      richTexts.push({ type: 'text', text: { content: match[4] || match[5] }, annotations: { italic: true } });
    } else if (match[6]) { // code
      richTexts.push({ type: 'text', text: { content: match[6] }, annotations: { code: true } });
    } else if (match[7] && match[8]) { // link
      richTexts.push({ type: 'text', text: { content: match[7] }, href: match[8] });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    richTexts.push({ type: 'text', text: { content: text.slice(lastIndex) } });
  }
  return richTexts.length ? richTexts : [{ type: 'text', text: { content: text } }];
}

function parseMarkdownTable(tableLines) {

  // Parse header
  const headerLine = tableLines[0].trim();
  const headerCells = headerLine.split('|').map(cell => cell.trim()).filter(Boolean);

  // Parse rows
  const rows = [];
  for (let i = 2; i < tableLines.length; i++) {
    const rowLine = tableLines[i].trim();
    if (!rowLine) continue;
    const rowCells = rowLine.split('|').map(cell => cell.trim()).filter(Boolean);
    rows.push(rowCells);
  }

  // Build Notion table block
  return {
    object: 'block',
    type: 'table',
    table: {
      table_width: headerCells.length,
      has_column_header: true,
      has_row_header: false,
      children: [
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: headerCells.map(cell => [ { type: 'text', text: { content: cell } } ])
          }
        },
        ...rows.map(rowCells => ({
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: headerCells.map((_, idx) => [
              { type: 'text', text: { content: rowCells[idx] || '' } }
            ])
          }
        }))
      ]
    }
  };
}

function markdownToBlocks(markdown) {
  if (typeof markdown !== 'string') return [];

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let listBuffer = [];
  let listType = null;
  let codeBuffer = [];
  let codeLang = '';
  let inCode = false;
  let tableBuffer = [];
  let inTable = false;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    if (listType === 'bulleted') {
      listBuffer.forEach(item => {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: richTextFromMarkdown(item)
          }
        });
      });
    } else if (listType === 'numbered') {
      listBuffer.forEach(item => {
        blocks.push({
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: richTextFromMarkdown(item)
          }
        });
      });
    }
    listBuffer = [];
    listType = null;
  };

  const flushCode = () => {
    if (codeBuffer.length === 0) return;
    const notionLang = languageMap[codeLang.toLowerCase()] || 'plain text';
    blocks.push({
      object: 'block',
      type: 'code',
      code: {
        rich_text: [{ type: 'text', text: { content: codeBuffer.join('\n') } }],
        language: notionLang
      }
    });
    codeBuffer = [];
    codeLang = '';
  };

  const flushTable = () => {
    if (tableBuffer.length >= 2) {
      blocks.push(parseMarkdownTable(tableBuffer));
    }
    tableBuffer = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Table detection: line with | and next line with --- 
    if (
      line.trim().startsWith('|') &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(lines[i + 1])
    ) {
      flushList();
      flushCode();
      inTable = true;
      tableBuffer.push(line);
      tableBuffer.push(lines[++i]);
      continue;
    }
    if (inTable) {
      // Continue collecting table rows until a non-table line
      if (line.trim().startsWith('|')) {
        tableBuffer.push(line);
        continue;
      } else {
        flushTable();
      }
    }

    // Image ![Alt](URL) (check before all other block types!)
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushList();
      flushCode();
      flushTable();
      blocks.push({
        object: 'block',
        type: 'image',
        image: {
          type: 'external',
          external: { url: imageMatch[2] }
        }
      });
      continue;
    }

    // Code block start/end
    const codeMatch = line.match(/^```(\w*)/);
    if (codeMatch) {
      if (!inCode) {
        inCode = true;
        codeLang = codeMatch[1] || 'plain text';
      } else {
        inCode = false;
        flushCode();
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // Horizontal line ---
    if (/^---+$/.test(line.trim())) {
      flushList();
      blocks.push({ object: 'block', type: 'divider', divider: {} });
      continue;
    }

    // Headings ###, ##, #
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      blocks.push({
        object: 'block',
        type: `heading_${level}`,
        [`heading_${level}`]: {
          rich_text: [{ type: 'text', text: { content: headingMatch[2] } }]
        }
      });
      continue;
    }

    // Blockquote >
    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushList();
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: quoteMatch[1] } }]
        }
      });
      continue;
    }

    // Todo list - [ ] or - [x]
    const todoMatch = line.match(/^- \[([ xX])\] (.*)$/);
    if (todoMatch) {
      flushList();
      blocks.push({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content: todoMatch[2] } }],
          checked: todoMatch[1].toLowerCase() === 'x'
        }
      });
      continue;
    }

    // Bulleted list -
    const bulletMatch = line.match(/^[-*+] (.*)$/);
    if (bulletMatch) {
      if (listType !== 'bulleted') flushList();
      listType = 'bulleted';
      listBuffer.push(bulletMatch[1]);
      continue;
    }

    // Numbered list 1. or 1)
    const numberedMatch = line.match(/^\d+[.)] (.*)$/);
    if (numberedMatch) {
      if (listType !== 'numbered') flushList();
      listType = 'numbered';
      listBuffer.push(numberedMatch[1]);
      continue;
    }

    // Empty line
    if (/^\s*$/.test(line)) {
      flushList();
      continue;
    }

    flushList();
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: line } }]
      }
    });
  }

  flushList();
  flushCode();

  return blocks;
}

export { markdownToBlocks };
