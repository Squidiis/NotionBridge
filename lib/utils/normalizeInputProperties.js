/**
 * Converts user-friendly input properties into the structure required by the Notion API.
 *
 * Supports common Notion property types like title, rich_text, number, checkbox, date,
 * select, and multi_select. This is useful for page creation and updating.
 *
 * @param {Object} inputProps - Object where keys are property names and values are simplified inputs.
 * @returns {Object} Normalized properties object compatible with Notion's API.
 * @example
 * normalizeInputProperties({
 *   Name: "My Page",
 *   Status: { select: "Open" },
 *   Tags: { multi_select: ["Tag1", "Tag2"] },
 *   Due: new Date(),
 *   Done: false
 * });
 */
function normalizeInputProperties(inputProps) {

	const result = {};

	for (const [key, value] of Object.entries(inputProps)) {

		if (typeof value === 'string') {
		result[key] = {
			title: [{ text: { content: value } }]
		};
		} else if (typeof value === 'boolean') {
		result[key] = { checkbox: value };
		} else if (typeof value === 'number') {
		result[key] = { number: value };
		} else if (value instanceof Date) {
		result[key] = {
			date: { start: value.toISOString() }
		};
		} else if (typeof value === 'object' && value.select) {
		result[key] = { select: { name: value.select } };
		} else if (typeof value === 'object' && value.multi_select) {
		result[key] = {
			multi_select: value.multi_select.map((name) => ({ name }))
		};
		} else {
		result[key] = {
			rich_text: [{ text: { content: String(value) } }]
		};
		}
	}

	return result;
}

export { normalizeInputProperties };
