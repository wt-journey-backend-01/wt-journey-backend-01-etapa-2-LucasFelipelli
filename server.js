const express = require('express')
const app = express();
const PORT = 3000;

// Documentação
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Documentação

const agentesRouter = require("./routes/agentesRoutes");
const casosRouter   = require("./routes/casosRoutes");

app.use(express.json());
app.use('/agentes', agentesRouter);
app.use('/casos', casosRouter);

app.get('/', (req, res) => {
    res.json({"Inicio": "Para utilizar nossa API use as rotas /agentes ou /casos"});
});

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});