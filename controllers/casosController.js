/*
Vamos considerar que em requisições POST, PUT e PATCH que se o usuario mandar no req.body
um campo diferente daqueles permitidos que nosso prohgrama vai apenas ignorar esses campos
e seguir em frente sem levantar um erro.

EX:
curl -X PATCH http://localhost:3000/casos/1 \
     -H "Content-Type: application/json" \
     -d '{"titulo": "novo", "blabla": 2}'

Aq vamos apenas ignorar o campo "blablba" e seguir em frente, fingir q ele nao existe 
*/

const casosRepository = require("../repositories/casosRepository");
const utils           = require("../utils/errorHandler");
const agentes         = require("../repositories/agentesRepository");

const { v4: gerarUUID, validate: validarUUID } = require('uuid');

function getAllCasos(req, res) {
    let casos = casosRepository.findAll();
    if (casos && casos.length > 0) {
        if (req.query) {
            if (req.query['agente_id']) {
                casos = casos.filter(  (caso) => (caso.agente_id === req.query.agente_id)  );
            }
            if (req.query['status']) {
                casos = casos.filter(  (caso) => (caso.status.toLowerCase() === req.query.status.toLowerCase())  );
            }
        }
        if (casos) {
            return res.status(200).json(utils.montarResposta(
                "200",
                "sucesso",
                casos,
                null
            ));
        } else {
            return res.status(204).end();
        }
        
    } else {
        return res.status(204).end();
    }
}

function getCasoById(req, res) {
    const casoInfo = casosRepository.findCasoById(req.params.id);
    if (! validarUUID(req.params.id)) { // verifica se id é UUID e se nao for vms enviar erro 400
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "id do caso precisa seguir formato UUID"
        ));
    }
    if (casoInfo) {
        res.status(200).json(utils.montarResposta(
            "200",
            "sucesso",
            casoInfo,
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

function criarCaso(req, res) {
    const camposEsperados = ['titulo', 'descricao', 'status', 'agente_id'];
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
    
    let {id, titulo, descricao, status, agente_id} = req.body;

    if (id) {
        if (! validarUUID(id)) { // verifica se id é UUID e se nao for vms enviar erro 400
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                "id do caso precisa seguir formato UUID"
            ));
        }
    } else {
        id = gerarUUID();
    }

    if (casosRepository.findCasoById(id)) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "um caso com esse mesmo ID ja foi cadastrado"
        ));
    }
    
    if (! validarUUID(agente_id)) { // verifica se id é UUID e se nao for vms enviar erro 400
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "id do agente a ser cadastrado precisa seguir formato UUID"
        ));
    }
    if (! agentes.findAgenteById(agente_id)) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "agente nao cadastrado"
        ));
    }
    if (typeof titulo !== "string") { // vms considerar q o titulo pode ser uma string vazia
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "titulo do caso deve ser uma string"
        ));
    }
    if (typeof descricao !== "string") { // vms considerar q a descricao pode ser uma string vazia
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "descricao do caso deve ser uma string"
        ));
    }
    if (status.toLowerCase() !== "aberto" && status.toLowerCase() !== "solucionado") {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "status deve obrigatoriamente possuir um desses 2 valores: [\"aberto\", \"solucionado\"]"
        ));
    }

    const caso = casosRepository.createCaso(id, titulo, descricao, status.toLowerCase(), agente_id);
    casosRepository.pushCaso(caso);

    res.status(201).json(utils.montarResposta(
        "201",
        "criado",
        caso,
        null
    ));
}

function atualizarCasoCompleto(req, res) {
    if (! casosRepository.findCasoById(req.params.id)) {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "ID nao encontrado"
        ));
    }

    const camposEsperados = ['titulo', 'descricao', 'status', 'agente_id'];
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
    
    let {id, titulo, descricao, status, agente_id} = req.body;

    if (id && id !== req.params.id) { // o ID não é obrigatorio ja que ja informamos ele na url mas se for informado deve ser igual ao da url
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "ID informado na URL difere do ID informado na requisição"
        ));
    }

    if (! validarUUID(agente_id)) { // verifica se id é UUID e se nao for vms enviar erro 400
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "id do agente precisa seguir formato UUID"
        ));
    }

    if (! agentes.findAgenteById(agente_id)) {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "agente nao cadastrado"
        ));
    }
    if (typeof titulo !== "string") { // vms considerar q o titulo pode ser uma string vazia
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "titulo do caso deve ser uma string"
        ));
    }
    if (typeof descricao !== "string") { // vms considerar q a descricao pode ser uma string vazia
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "descricao do caso deve ser uma string"
        ));
    }
    if (status.toLowerCase() !== "aberto" && status.toLowerCase() !== "solucionado") {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "status deve obrigatoriamente possuir um desses 2 valores: [\"aberto\", \"solucionado\"]"
        ));
    }

    const casoNovo = {
        "id": req.params.id,
        "titulo": titulo,
        "descricao": descricao,
        "status": status.toLowerCase(),
        "agente_id": agente_id
    };
    casosRepository.replaceCaso(req.params.id, casoNovo);

    res.status(200).json(utils.montarResposta(
        "200",
        "sucesso",
        casoNovo,
        null
    ));
}

function atualizarCasoParcial(req, res) {
    if (! casosRepository.findCasoById(req.params.id)) {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "ID nao encontrado"
        ));
    }

    const camposPossiveis   = ['id', 'titulo', 'descricao', 'status', 'agente_id'];
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
    
    let {id, titulo, descricao, status, agente_id} = req.body;

    if (id && id !== req.params.id) { // o ID não é obrigatorio ja que ja informamos ele na url mas se for informado deve ser igual ao da url
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "ID informado na URL difere do ID informado na requisição"
        ));
    }
    if (agente_id) {
        if (! validarUUID(agente_id)) { // verifica se id é UUID e se nao for vms enviar erro 400
            return res.status(400).json(utils.montarResposta(
                "400",
                "Erro",
                null,
                "id do agente precisa seguir formato UUID"
            ));
        }
        if (! agentes.findAgenteById(agente_id)) {
            return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "agente nao cadastrado"
        ));
        }
    }
    if (titulo && typeof titulo !== "string") { // vms considerar q o titulo pode ser uma string vazia
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "titulo do caso deve ser uma string"
        ));
    }
    if (descricao && typeof descricao !== "string") { // vms considerar q a descricao pode ser uma string vazia
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "descricao do caso deve ser uma string"
        ));
    }
    if (status && status.toLowerCase() !== "aberto" && status.toLowerCase() !== "solucionado") {
        return res.status(400).json(utils.montarResposta(
            "400",
            "Erro",
            null,
            "status deve obrigatoriamente possuir um desses 2 valores: [\"aberto\", \"solucionado\"]"
        ));
    }

    let camposToUpdate = {
        "titulo": titulo,
        "descricao": descricao,
        "status": status ? status.toLowerCase() : undefined,
        "agente_id": agente_id
    };

    for (let campo in camposToUpdate) {
        if (camposToUpdate[campo] === undefined) {
            delete camposToUpdate[campo];
        }
    }

    const casoNovo = casosRepository.updateCaso(req.params.id, camposToUpdate);

    res.status(200).json(utils.montarResposta(
        "200",
        "sucesso",
        casoNovo,
        null
    ));
}

function deletarCaso(req, res) {
    if (! casosRepository.findCasoById(req.params.id)) {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "ID nao encontrado"
        ));
    }

    casosRepository.deleteCaso(req.params.id);

    res.status(204).end();
}

function getAgenteDoCaso(req, res) {
    const caso = casosRepository.findCasoById(req.params.caso_id);
    
    if (! caso) {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "Nenhum caso com esse ID foi encontrado"
        ));
    }
    
    const agente = agentes.findAgenteById(caso.agente_id);
    if (agente) {
        return res.status(200).json(utils.montarResposta(
            "200",
            "sucesso",
            agente,
            null
        ));
    } else {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "agente responsavel pelo caso nao encontrado"
        ));
    }
}

function searchCasoByQuery(req, res) {
    let casos = casosRepository.findAll();

    if (req.query.q) {
        const queryToSearch = req.query.q.toLowerCase();
        
        casos = casos.filter(  (caso) => (  caso.titulo.toLowerCase().includes(queryToSearch) || caso.descricao.toLowerCase().includes(queryToSearch)  )  );

        res.status(200).json(utils.montarResposta(
            "200",
            "sucesso",
            casos,
            null
        ));
    } else {
        return res.status(404).json(utils.montarResposta(
            "404",
            "Erro",
            null,
            "query string q=xxxx não informada ou vazia"
        ));
    }
}

module.exports = {
    getAllCasos,
    getCasoById,
    criarCaso,
    atualizarCasoCompleto,
    atualizarCasoParcial,
    deletarCaso,
    getAgenteDoCaso,
    searchCasoByQuery
};
