#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import mysql from "mysql2/promise";

// CONFIGURAÇÃO VIA VARIÁVEIS DE AMBIENTE
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const server = new Server(
  { name: "mysql-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Ferramenta: Listar ferramentas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("LOG: Cliente MCP pediu a lista de ferramentas.");
  return {
    tools: [{
      name: "query",
      description: "Executa qualquer SQL no banco de dados configurado",
      inputSchema: {
        type: "object",
        properties: { sql: { type: "string" } },
        required: ["sql"]
      }
    }]
  };
});

// Ferramenta 2: Executar Query
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "query") {
    const sql = request.params.arguments.sql;
    console.error(`LOG: Tentando executar SQL: ${sql}`);
    
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      console.error("LOG: Conexão com banco SUCESSO!");
      
      const [rows] = await connection.execute(sql);
      await connection.end();
      
      return { content: [{ type: "text", text: JSON.stringify(rows, null, 2) }] };
    } catch (error) {
      console.error(`LOG: ERRO SQL: ${error.message}`);
      return { 
        content: [{ type: "text", text: `Erro ao executar: ${error.message}` }], 
        isError: true 
      };
    }
  }
  throw new Error("Ferramenta não encontrada");
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("LOG: Servidor MCP MySQL Iniciado e aguardando...");