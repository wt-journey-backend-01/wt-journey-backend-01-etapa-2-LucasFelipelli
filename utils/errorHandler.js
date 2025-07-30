function verificarUUID(texto) {
    const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regexUUID.test(texto);
}

function verificarData(texto, aceitarDatasFuturas=0, dataLimite='1900-01-01') {
    /*
    parametros:
    texto               ---> a data em si. EX: "2020-06-25"
    aceitarDatasFuturas ---> se 1 vamos aceitar datas posteriores a data de hoje, se 0 não.
    dataLimite          ---> Não vamos aceitar datas anteriores a dataLimite (se dataLimite == 0 então pode ser qlquer data)
    
    valores de retorno:
    -1 ---> significa formato incorreto. ou seja !== YYYY-MM-DD
    -2 ---> significa data invalida. EX: (2025-99-99)
    -3 ---> data informada maior que a data de hoje (aceitarDatasFuturas == 1)
    -4 ---> data informada é anterior a data limite
    -5 ---> parametro dataLimite invalido (deve seguir formato YYYY-MM-DD)
     0 ---> significa que a data é valida
    */
    
    const regexDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    if (!regexDate.test(texto)) { // se nao passar no teste então ta no formato incorreto
        return -1; // significa formato incorreto
    }
    if (!regexDate.test(dataLimite)) { // se nao passar no teste então ta no formato incorreto
        return -5; // significa formato incorreto
    }

    let dataLimiteTimeStamp = new Date(dataLimite).getTime();
    
    if (!dataLimiteTimeStamp) { // se for uma data invalida tipo: 2025-99-99 vai retornar NaN
        return -5;
    }
    
    
    let dataInformada = new Date(texto).getTime();
    
    if (dataInformada) { // se for uma data invalida tipo: 2025-99-99 vai retornar NaN
        let hoje = new Date().getTime()

        if (!aceitarDatasFuturas && dataInformada > hoje) {
            return -3;
        }
        if (dataLimite && dataInformada < dataLimiteTimeStamp) {
            return -4;
        }
        
        return 0;
    } else {
        return -2;
    }

}

function montarResposta(status, message, data, error) {
    const res = {
        "status": status,
        "message": message
    }
    if (data) {
        res["data"] = data;
    }
    
    if (error) {
        res["Error"] = error;
    }
    return res;
}

module.exports = {
    verificarUUID,
    verificarData,
    montarResposta
};
