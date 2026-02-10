# MySQL MCP Server

This project implements a Model Context Protocol (MCP) server to interact with MySQL databases. It allows executing SQL queries directly through MCP-compatible clients (such as Trae or Claude Desktop).

**Author:** Pedro Leão (Senior Fullstack Developer)  
- **GitHub:** [@pleaodev](https://github.com/pleaodev)  
- **Portfolio:** [https://www.pedro-sperandio.com.br/](https://www.pedro-sperandio.com.br/)  
- **Email:** pleao.dev@gmail.com

## Prerequisites

- [Node.js](https://nodejs.org/) installed.

## Installation

1. Clone or download this repository.
2. Open a terminal in the project folder.
3. Install dependencies by running:

```bash
npm install
```

## MCP Configuration

To use this server in your MCP client, add the following configuration to your MCP servers configuration file (e.g., `claude_desktop_config.json` or Trae settings).

You **MUST** provide your database credentials via environment variables in the `env` block.

> **Note:** Make sure to adjust the path in the `args` argument to the absolute path where the `index.js` file of this project is located on your system.

```json
{
  "mcpServers": {
    "mysql": {
      "command": "node",
      "args": [
        "C:\\ABSOLUTE\\PATH\\TO\\pedro-leao-mcp-mysql-server\\index.js"
      ],
      "env": {
        "DB_HOST": "127.0.0.1",
        "DB_PORT": "3306",
        "DB_USER": "your_username",
        "DB_PASSWORD": "your_password",
        "DB_NAME": "your_database_name"
      }
    }
  }
}
```

### Environment Variables

The server uses the following environment variables for connection:

| Variable | Description | Default Value (if not set) |
| :--- | :--- | :--- |
| `DB_HOST` | MySQL server address | `localhost` |
| `DB_PORT` | MySQL server port | `3306` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | User password | *(no default)* |
| `DB_NAME` | Database name | *(no default)* |

## Features

### Available Tools

- **query**: Executes any SQL query on the configured database.
  - **Parameters:** `sql` (string) - The SQL query to execute.

## Troubleshooting

- **Connection Error:** Check if the credentials in the `env` block are correct and if the MySQL server is running and accessible.
- **File Path:** Ensure you are using absolute paths in the `args` array and use double backslashes (`\\`) if you are on Windows.
