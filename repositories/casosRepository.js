const casos = [];

function findAll() {
    return casos; // retorna todos os casos
}

function findCasoById(id) {
    return casos.find(  (caso) => (caso.id === id)  ); // retorna o caso em si (objeto)
}

function findCasoInfo(id, campo) {
    const caso = casos.findIndex(  (caso) => (caso.id === id)  );
    return casos[caso][campo]; // retorna o valor de uma chave especifica de um caso especifico
}

function pushCaso(caso) {
    return casos.push(caso) - 1; // retorna o index do caso no array casos
}

function createCaso(id, titulo, descricao, status, agente_id) {
    const caso = {
        "id": id,
        "titulo": titulo,
        "descricao": descricao,
        "status": status,
        "agente_id": agente_id
    };

    return caso; // retorna o caso criado
}

function replaceCaso(id, casoNovo) {
    const caso = casos.findIndex(  (caso) => (caso.id === id)  );
    casos[caso] = casoNovo;

    return caso; // index onde se encontra o caso novo
}

function updateCaso(id, camposToUpdate) {
    const caso = casos.findIndex(  (caso) => (caso.id === id)  );

    for (let campo in camposToUpdate) { // camposToUpdate = {"status": "", "agente_id": xxxx}
        casos[caso][campo] = camposToUpdate[campo];
    }

    return casos[caso]; // caso updated
}

function deleteCaso(id) {
    const caso = casos.findIndex(  (caso) => (caso.id === id)  );
    return casos.splice(caso, 1)[0]; // retorna o caso deletado
}

module.exports = {
    findAll,
    findCasoById,
    findCasoInfo,
    pushCaso,
    createCaso,
    replaceCaso,
    updateCaso,
    deleteCaso
};
