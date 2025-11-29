/**
 * Módulo responsável pela transformação de dados (Data Transformation Layer).
 * Converte o contrato de entrada (Legacy/PT-BR) para o esquema do Banco (Internal/EN).
 */

const mapInputToDb = (inputJson) => {
    // Validação básica de contrato (Fail Fast)
    if (!inputJson || !inputJson.items) {
        throw new Error("Payload inválido: 'items' é obrigatório.");
    }

    return {
        // Mapeamento Direto: Origem -> Destino
        orderId: inputJson.numeroPedido,      // PDF pede: numeroPedido -> orderId
        value: inputJson.valorTotal,          // PDF pede: valorTotal -> value
        creationDate: inputJson.dataCriacao,  // PDF pede: dataCriacao -> creationDate
        
        // Mapeamento de Lista (Array Map)
        items: inputJson.items.map(item => ({
            productId: Number(item.idItem),        // Converte string "2434" para numero 2434
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
};

module.exports = { mapInputToDb };
