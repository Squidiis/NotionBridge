const { Client } = require("@notionhq/client");
const db = require("./lib/database");
const pages = require("./lib/pages");

let notion = null;

function init(token) {
  notion = new Client({ auth: token });
  
  return {

    // database.js
    getDatabaseProperties: (id) => db.getDatabaseProperties(notion, id),
    queryDatabase: (id, filter) => db.queryDatabase(notion, id, filter),
    queryAllDatabase: (id, filter) => db.queryAllDatabase(notion, id, filter),
  };
}

module.exports = { init };
