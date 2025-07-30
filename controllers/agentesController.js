/*
Vamos considerar que em requisições POST, PUT e PATCH que se o usuario mandar no req.body
um campo diferente daqueles permitidos que nosso prohgrama vai apenas ignorar esses campos
e seguir em frente sem levantar um erro.

EX:
curl -X PATCH http://localhost:3000/casos/1 \
     -H "Content-Type: application/json" \
     -d '{"nom": "Lucas Felipelli", "blabla": 2}'

Aq vamos apenas ignorar o campo "blablba" e seguir em frente, fingir q ele nao existe 
*/

const agentesRepository = require("../repositories/agentesRepository");
const utils           = require("../utils/errorHandler");

const dataLimiteIncorporacao = '1900-01-01';

function getAllAgentes(req, res) {
    let agentes = agentesRepository.findAll();
    
    if (agentes) {
        if (req.query) {
            if (req.query['cargo']) {
                agentes = agentes.filter(  (agente) => (agente.cargo === req.query.cargo)  );
            }
            if (req.query['sort']) {
                if (req.query['sort'] === 'dataDeIncorporacao') { // do mais antigo pro mais novo
                    agentes.sort(  (a, b) => (  new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao)  ));
                } else if (req.query['sort'] === '-dataDeIncorporacao') { // do mais novo pro mais antigo
                    agentes.sort(  (a, b) => (  new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao)  ));
                } else {
                    return res.status(400).json(utils.montarResposta(
                        "400",
                        "Erro",
                        null,
                        `query "sort" aceita apenas 2 valores: [dataDeIncorporacao, -dataDeIncorporacao]`
                    ));
                }
            }
        }
        
        if (agentes) {
            res.status(200).json(utils.montarResposta(
                "200",
                "sucesso",
                agentes,
                null));
        } else {
            res.status(204).end();
        }
    } else {
        res.status(204).end();
    }
}

function getAgenteById(req, res) {
    const agenteInfo = agentesRepository.findAgenteById(req.params.id);
    if (! utils.verificarUUID(req.params.id)) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "id do caso precisa seguir formato UUID"
        ));
    }
    if (agenteInfo) {
        res.status(200).json(utils.montarResposta(
            "200",
            "sucesso",
            agenteInfo,
            null
        ));
    } else {
        res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "ID nao encontrado"
        ));
    }
}

function cadastrarAgente(req, res) {
    const camposEsperados = ['id', 'nome', 'dataDeIncorporacao', 'cargo'];
    const camposRecebidos = Object.keys(req.body);
    let   camposFaltantes = [];
    
    for (let i = 0; i < camposEsperados.length; i++) {
        if ( ! camposRecebidos.includes(camposEsperados[i]) ) {
            camposFaltantes.push(camposEsperados[i]);
        }
    }

    if (camposFaltantes.length) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            `Campos: [${camposFaltantes}] nao foram informados`
        ));
    }
    
    const {id, nome, dataDeIncorporacao, cargo} = req.body;

    if (! utils.verificarUUID(id)) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "id do agente precisa seguir formato UUID"
        ));
    }

    if (agentesRepository.findAgenteById(id)) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "ja existe um agente com esse id cadastrado"
        ));
    }
    
    if (typeof nome !== "string" || !nome) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "nome do agente deve ser uma string não vazia"
        ));
    }

    const isDataValida = utils.verificarData(dataDeIncorporacao, 0, dataLimiteIncorporacao);
    if (isDataValida) { // return 0 significa data correta
        if (isDataValida === -1) {
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                "dataDeIncorporacao não obedece o formato YYYY-MM-DD"
            ));
        }
        if (isDataValida === -2) {
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                "dataDeIncorporacao é uma data invalida. EX: (2025-99-99)"
            ));
        }
        if (isDataValida === -3) {
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                "dataDeIncorporacao maior que a data de hoje"
            ));
        }
        if (isDataValida === -4) {
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                `dataDeIncorporacao é anterior a data limite que no caso possui o valor de: ${dataLimiteIncorporacao}`
            ));
        }
        if (isDataValida === -5) {
            return res.status(500).json(utils.montarResposta(
                "500",
                "Erro",
                null,
                "erro interno do servidor, favor informar ao admin (dataLimiteIncorporacao com formato invalido)"
            ));
        }
    }

    if (typeof cargo !== 'string' || !cargo) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "cargo do agente deve ser uma string não vazia"
        ));
    }

    const agente = agentesRepository.createAgente(id, nome, dataDeIncorporacao, cargo);
    agentesRepository.pushAgente(agente);

    res.status(201).json(utils.montarResposta(
        "201",
        "criado",
        agente,
        null
    ));
}

function atualizarAgenteCompleto(req, res) {
    if (! agentesRepository.findAgenteById(req.params.id)) {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "ID nao encontrado"
        ));
    }

    const camposEsperados = ['nome', 'dataDeIncorporacao', 'cargo'];
    const camposRecebidos = Object.keys(req.body);
    let   camposFaltantes = [];
    
    for (let i = 0; i < camposEsperados.length; i++) {
        if ( ! camposRecebidos.includes(camposEsperados[i]) ) {
            camposFaltantes.push(camposEsperados[i]);
        }
    }

    if (camposFaltantes.length) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            `Campos: [${camposFaltantes}] nao foram informados`
        ));
    }
    
    const {id, nome, dataDeIncorporacao, cargo} = req.body;

    if (id && id !== req.params.id) { // o ID não é obrigatorio ja que ja informamos ele na url mas se for informado deve ser igual ao da url
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "ID informado na URL difere do ID informado na requisição"
        ));
    }

    if (typeof nome !== "string" || !nome) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "nome do agente deve ser uma string não vazia"
        ));
    }

    const isDataValida = utils.verificarData(dataDeIncorporacao, 0, dataLimiteIncorporacao);
    if (isDataValida) { // return 0 significa data correta
        if (isDataValida === -1) {
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                "dataDeIncorporacao não obedece o formato YYYY-MM-DD"
            ));
        }
        if (isDataValida === -2) {
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                "dataDeIncorporacao é uma data invalida. EX: (2025-99-99)"
            ));
        }
        if (isDataValida === -3) {
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                "dataDeIncorporacao maior que a data de hoje"
            ));
        }
        if (isDataValida === -4) {
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                `dataDeIncorporacao é anterior a data limite que no caso possui o valor de: ${dataLimiteIncorporacao}`
            ));
        }
        if (isDataValida === -5) {
            return res.status(500).json(utils.montarResposta(
                "500",
                "Erro",
                null,
                "erro interno do servidor, favor informar ao admin (dataLimiteIncorporacao com formato invalido)"
            ));
        }
    }

    if (typeof cargo !== 'string' || !cargo) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "cargo do agente deve ser uma string não vazia"
        ));
    }

    const agenteNovo = {
        "id": req.params.id,
        "nome": nome,
        "dataDeIncorporacao": dataDeIncorporacao,
        "cargo": cargo
    };

    agentesRepository.replaceAgente(req.params.id, agenteNovo);

    res.status(200).json(utils.montarResposta(
        "200",
        "sucesso",
        agenteNovo,
        null
    ));
}

function atualizarAgenteParcial(req, res) {
    if (! agentesRepository.findAgenteById(req.params.id)) {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "ID nao encontrado"
        ));
    }

    const camposPossiveis   = ['id', 'nome', 'dataDeIncorporacao', 'cargo'];
    const camposRecebidos   = Object.keys(req.body);
    let   camposValidos     = []; // vamos ver dentre os campos recebidos algum deles é um camposPossivel
    
    for (let i = 0; i < camposPossiveis.length; i++) {
        if ( camposRecebidos.includes(camposPossiveis[i]) ) {
            camposValidos.push(camposPossiveis[i]);
        }
    }

    if (! camposValidos.length) { // se nao informarmos nenhum campo valido
        return res.status(204).end();
    }
    
    const {id, nome, dataDeIncorporacao, cargo} = req.body;

    if (id && id !== req.params.id) { // o ID não é obrigatorio ja que ja informamos ele na url mas se for informado deve ser igual ao da url
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "ID informado na URL difere do ID informado na requisição"
        ));
    }

    if (nome &&  (typeof nome !== "string" || !nome)  ) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "nome do agente deve ser uma string não vazia"
        ));
    }

    if (dataDeIncorporacao) {
        const isDataValida = utils.verificarData(dataDeIncorporacao, 0, dataLimiteIncorporacao);
        if (isDataValida) { // return 0 significa data correta
            if (isDataValida === -1) {
                return res.status(400).json(utils.montarResposta(
                    "400",
                    "Erro",
                    null,
                    "dataDeIncorporacao não obedece o formato YYYY-MM-DD"
                ));
            }
            if (isDataValida === -2) {
                return res.status(400).json(utils.montarResposta(
                    "400",
                    "Erro",
                    null,
                    "dataDeIncorporacao é uma data invalida. EX: (2025-99-99)"
                ));
            }
            if (isDataValida === -3) {
                return res.status(400).json(utils.montarResposta(
                    "400",
                    "Erro",
                    null,
                    "dataDeIncorporacao maior que a data de hoje"
                ));
            }
            if (isDataValida === -4) {
                return res.status(400).json(utils.montarResposta(
                    "400",
                    "Erro",
                    null,
                    `dataDeIncorporacao é anterior a data limite que no caso possui o valor de: ${dataLimiteIncorporacao}`
                ));
            }
            if (isDataValida === -5) {
                return res.status(500).json(utils.montarResposta(
                    "500",
                    "Erro",
                    null,
                    "erro interno do servidor, favor informar ao admin (dataLimiteIncorporacao com formato invalido)"
                ));
            }
        }
    }

    if (cargo &&  (typeof cargo !== 'string' || !cargo)  ) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "cargo do agente deve ser uma string não vazia"
        ));
    }
   

    let camposToUpdate = {
        "nome": nome,
        "dataDeIncorporacao": dataDeIncorporacao,
        "cargo": cargo
    };

    for (let campo in camposToUpdate) {
        if (camposToUpdate[campo] === undefined) {
            delete camposToUpdate[campo];
        }
    }

    const agenteNovo = agentesRepository.updateAgente(req.params.id, camposToUpdate);

    res.status(200).json(utils.montarResposta(
        "200",
        "sucesso",
        agenteNovo,
        null
    ));
}

function deletarAgente(req, res) {
    if (! agentesRepository.findAgenteById(req.params.id)) {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "ID nao encontrado"
        ));
    }

    agentesRepository.deleteAgente(req.params.id);

    res.status(204).end();
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    cadastrarAgente,
    atualizarAgenteCompleto,
    atualizarAgenteParcial,
    deletarAgente
};
