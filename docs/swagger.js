const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Departamento de Polícia",
    version: "1.0.0",
    description: "API fictícia para gerenciamento de agentes e casos policiais."
  },
  servers: [
    {
      url: "http://localhost:3000"
    }
  ],
  paths: {
    "/casos": {
      get: {
        summary: "Lista todos os casos registrados",
        parameters: [
          {
            in: "query",
            name: "agente_id",
            schema: { type: "string" },
            description: "Filtra os casos por agente"
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: ["aberto", "solucionado"]
            },
            description: "Filtra os casos por status"
          },
          {
            in: "query",
            name: "q",
            schema: { type: "string" },
            description: "Busca por palavra-chave no título ou descrição"
          }
        ],
        responses: {
          200: {
            description: "Lista de casos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Caso" }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Cria um novo caso",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Caso" }
            }
          }
        },
        responses: {
          201: {
            description: "Caso criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Caso" }
              }
            }
          }
        }
      }
    },
    "/casos/{id}": {
      get: {
        summary: "Retorna os detalhes de um caso específico",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Detalhes do caso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Caso" }
              }
            }
          },
          404: { description: "Caso não encontrado" }
        }
      },
      put: {
        summary: "Atualiza completamente os dados de um caso",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Caso" }
            }
          }
        },
        responses: {
          200: { description: "Caso atualizado com sucesso" }
        }
      },
      patch: {
        summary: "Atualiza parcialmente os dados de um caso",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Caso" }
            }
          }
        },
        responses: {
          200: { description: "Caso atualizado com sucesso" }
        }
      },
      delete: {
        summary: "Remove um caso do sistema",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          204: { description: "Caso removido com sucesso" }
        }
      }
    },
    "/casos/{caso_id}/agente": {
      get: {
        summary: "Retorna o agente responsável por um caso específico",
        parameters: [
          {
            in: "path",
            name: "caso_id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Agente do caso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Agente" }
              }
            }
          },
          404: { description: "Caso ou agente não encontrado" }
        }
      }
    },
    "/agentes": {
      get: {
        summary: "Lista todos os agentes",
        parameters: [
          {
            in: "query",
            name: "cargo",
            schema: {
              type: "string"
            },
            description: "Filtra por cargo"
          },
          {
            in: "query",
            name: "sort",
            schema: {
              type: "string",
              enum: ["dataDeIncorporacao", "-dataDeIncorporacao"]
            },
            description: "Ordena por data de incorporação"
          }
        ],
        responses: {
          200: {
            description: "Lista de agentes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Agente" }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Cadastra um novo agente",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Agente" }
            }
          }
        },
        responses: {
          201: {
            description: "Agente cadastrado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Agente" }
              }
            }
          }
        }
      }
    },
    "/agentes/{id}": {
      get: {
        summary: "Retorna um agente específico",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Detalhes do agente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Agente" }
              }
            }
          },
          404: { description: "Agente não encontrado" }
        }
      },
      put: {
        summary: "Atualiza completamente os dados de um agente",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Agente" }
            }
          }
        },
        responses: {
          200: { description: "Agente atualizado com sucesso" }
        }
      },
      patch: {
        summary: "Atualiza parcialmente os dados de um agente",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Agente" }
            }
          }
        },
        responses: {
          200: { description: "Agente atualizado com sucesso" }
        }
      },
      delete: {
        summary: "Remove um agente do sistema",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          204: { description: "Agente removido com sucesso" }
        }
      }
    }
  },
  components: {
    schemas: {
      Caso: {
        type: "object",
        required: ["id", "titulo", "descricao", "status", "agente_id"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46"
          },
          titulo: { type: "string", example: "homicidio" },
          descricao: {
            type: "string",
            example: "Disparos foram reportados às 22:33 do dia 10/07/2007..."
          },
          status: {
            type: "string",
            enum: ["aberto", "solucionado"],
            example: "aberto"
          },
          agente_id: {
            type: "string",
            format: "uuid",
            example: "401bccf5-cf9e-489d-8412-446cd169a0f1"
          }
        }
      },
      Agente: {
        type: "object",
        required: ["id", "nome", "dataDeIncorporacao", "cargo"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "401bccf5-cf9e-489d-8412-446cd169a0f1"
          },
          nome: { type: "string", example: "Rommel Carneiro" },
          dataDeIncorporacao: {
            type: "string",
            format: "date",
            example: "1992-10-04"
          },
          cargo: { type: "string", example: "delegado" }
        }
      },
      ErroValidacao: {
        type: "object",
        properties: {
          status: { type: "integer", example: 400 },
          message: { type: "string", example: "Parâmetros inválidos" },
          errors: {
            type: "object",
            additionalProperties: { type: "string" },
            example: {
              status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
            }
          }
        }
      }
    }
  }
};


module.exports = swaggerDefinition;

