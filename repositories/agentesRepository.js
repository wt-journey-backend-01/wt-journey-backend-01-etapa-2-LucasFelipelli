const agentes = [];

function findAll() {
    return agentes; // retorna tds os agentes
}

function findAgenteById(id) {
    return agentes.find(  (agente) => (agente.id === id)  ); // retorna o agente em si (objeto)
}

function pushAgente(agente) {
    return agentes.push(agente) - 1; // retorna o index do agente no array agentes
}

function createAgente(id, nome, dataDeIncorporacao, cargo) {
    const agente = {
        "id": id,
        "nome": nome,
        "dataDeIncorporacao": dataDeIncorporacao,
        "cargo": cargo
    };

    return agente; // retorna o agente criado
}

function replaceAgente(id, agenteNovo) {
    const agente = agentes.findIndex(  (agente) => (agente.id === id)  );
    agentes[agente] = agenteNovo;

    return agente; // index onde se encontra o agente
}

function updateAgente(id, camposToUpdate) {
    const agente = agentes.findIndex(  (agente) => (agente.id === id)  );

    for (let campo in camposToUpdate) { // camposToUpdate = {"id": "xxxx", "nome": xxxx}
        agentes[agente][campo] = camposToUpdate[campo];
    }

    return agentes[agente]; // agente updated
}

function deleteAgente(id) {
    const agente = agentes.findIndex(  (agente) => (agente.id === id)  );
    return agentes.splice(agente, 1)[0]; // retorna o agente deletado
}

module.exports = {
    findAll,
    findAgenteById,
    findAgenteInfo,
    pushAgente,
    createAgente,
    replaceAgente,
    updateAgente,
    deleteAgente
};
