/**
 * Converts Notion block objects (array) to Markdown string.
 * Supports paragraphs, headings, lists, quotes, code, images, dividers, to-dos, tables.
 * 
 * @param {Array} blocks - Array of Notion block objects (as returned by getBlockChildren or mapResponse)
 * @returns {string} Markdown string
 */
function blocksToMarkdown(blocks) {
  if (!Array.isArray(blocks)) return '';

  let md = '';

  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue;
    switch (block.type) {
      case 'paragraph':
        md += (block.text || '') + '\n\n';
        break;
      case 'heading_1':
        md += '# ' + (block.text || '') + '\n\n';
        break;
      case 'heading_2':
        md += '## ' + (block.text || '') + '\n\n';
        break;
      case 'heading_3':
        md += '### ' + (block.text || '') + '\n\n';
        break;
      case 'bulleted_list_item':
        md += '- ' + (block.text || '') + '\n';
        break;
      case 'numbered_list_item':
        md += '1. ' + (block.text || '') + '\n';
        break;
      case 'quote':
        md += '> ' + (block.text || '') + '\n\n';
        break;
      case 'divider':
        md += '---\n\n';
        break;
      case 'to_do':
        md += `- [${block.checked ? 'x' : ' '}] ${block.text || ''}\n`;
        break;
      case 'code':
        md += `\`\`\`${block.language || ''}\n${block.code || ''}\n\`\`\`\n\n`;
        break;
      case 'image':
        md += `![Image](${block.url || ''})\n\n`;
        break;
      case 'callout':
        md += `> ${block.text || ''}\n\n`;
        break;
      case 'toggle':
        md += `<details><summary>${block.text || ''}</summary>\n`;
        if (block.children && Array.isArray(block.children)) {
          md += blocksToMarkdown(block.children);
        }
        md += '\n</details>\n\n';
        break;
      case 'table':
        if (block.children && Array.isArray(block.children)) {
          const rows = block.children.map(row =>
            (row.cells || []).map(cellArr =>
              cellArr.map(cell => cell.text?.content || '').join('')
            )
          );
          if (rows.length > 0) {
            md += '| ' + rows[0].join(' | ') + ' |\n';
            md += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
            for (let i = 1; i < rows.length; i++) {
              md += '| ' + rows[i].join(' | ') + ' |\n';
            }
            md += '\n';
          }
        }
        break;
      default:
        if (block.text) md += block.text + '\n\n';
    }
    if (block.children && Array.isArray(block.children) && block.type !== 'toggle' && block.type !== 'table') {
      md += blocksToMarkdown(block.children);
    }
  }

  return md.trim();
}

export { blocksToMarkdown }
