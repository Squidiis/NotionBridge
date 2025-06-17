---
sidebar_position: 1
id: intro
title: Introduction
slug: /
---

# NotionBridge

**A minimalist wrapper for the Notion API – no official SDK required**  
⚠️ *Currently under active development*

**NotionBridge** is a lightweight JavaScript library that simplifies working with the Notion API. It offers an intuitive and minimal interface, removing unnecessary complexity and third-party dependencies. With just a few core functions, you can create, query, and manage Notion databases, pages, and blocks easily.

## Features

- Retrieve database properties (detailed or simplified)
- Query databases with filters
- Fetch all entries with automatic pagination
- Create new pages or databases
- Add content blocks (e.g. paragraphs, headings, lists, to-dos, callouts, quotes)
- Update or archive pages
- Delete or clear blocks
- No external SDK – uses native `fetch`

## Installation

Install NotionBridge directly from GitHub:

```bash
npm install git+https://github.com/Squidiis/NotionBridge.git
```

## Setup

To connect NotionBridge to your Notion workspace, you’ll need to:

### Create a Notion Integration
1. Go to https://www.notion.com/my-integrations

2. Click “New integration”

3. Fill in the required details:

4. Choose a name

5. Select your workspace

6. Enable necessary capabilities (e.g. Read, Write, Update, Delete)

7. Click Submit

8. Copy the Internal Integration Token – this is your API key

### Grant the Integration Access to Your Database
1. Open the target database or template in Notion

2. Click `Share` in the top-right corner

3. Under `Invite`, search for your integration (e.g. `NotionBridge`)

4. Click `Invite` to allow access

⚠️ Without this step, your integration will not be authorized and API requests will return a 403 Forbidden error.

## Example Usage
```js
import easynotion from 'easynotion';

const notion = easynotion('secret_abc123xyz456'); // Use your own integration token

// Example: Query a Notion database
const entries = await notion.queryDatabase('your-database-id');
console.log(entries);
```

## Finding Your Database ID
To find your Notion database ID:

Open the database in Notion

Copy the full URL for example:
https://www.notion.so/workspace/Database-Name-abcdef1234567890abcdef1234567890

The 32-character string at the end is your database ID