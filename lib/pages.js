async function queryDatabase(notionFetch, token, databaseId, filter = {}) {

  const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

  const data = await notionFetch(url, token, {
    method: 'POST',
    body: filter,
  });

  return data;
}


async function queryAllDatabase(notionFetch, token, databaseId, filter = {}) {

  const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

  let results = [];
  let start_cursor = undefined;

  do {
    const body = {
      ...filter,
      start_cursor,
    };

    const response = await notionFetch(url, token, {
      method: 'POST',
      body,
    });

    results = results.concat(response.results);
    start_cursor = response.has_more ? response.next_cursor : undefined;

  } while (start_cursor);

  return results;
}


export { queryDatabase, queryAllDatabase };