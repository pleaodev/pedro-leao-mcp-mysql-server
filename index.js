#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import mysql from "mysql2/promise";

// CONFIGURAÇÃO DIRETA (Para eliminar erro de variável de ambiente)
const dbConfig = {
  host: "127.0.0.1", // Força IPv4
  port: 3310,
  user: "savana_audio",
  password: process.env.DB_PASSWORD || "Rk202020@#$", // Pega do env ou usa o fixo se falhar
  database: "savana_audio"
};

const server = new Server(
  { name: "savana-local", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Ferramenta 1: Listar tabelas (para teste rápido)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("LOG: O Trae pediu a lista de ferramentas.");
  return {
    tools: [{
      name: "query",
      description: "Executa qualquer SQL no banco Savana Audio",
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
console.error("LOG: Servidor MCP Savana Iniciado e aguardando...");