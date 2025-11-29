const { mapInputToDb } = require('./mapper');

describe('Data Mapper', () => {
    test('deve converter payload em portugues para esquema em ingles', () => {
        const payloadEntrada = {
            "numeroPedido": "v100",
            "valorTotal": 100,
            "dataCriacao": "2023-01-01",
            "items": [
                { "idItem": "55", "quantidadeItem": 1, "valorItem": 50 }
            ]
        };

        const resultado = mapInputToDb(payloadEntrada);

        expect(resultado.orderId).toBe("v100");
        expect(resultado.items[0].productId).toBe(55); // Verifica a conversão para Number
        expect(resultado.items[0].quantity).toBe(1);
    });

    test('deve lançar erro se items não existirem', () => {
        expect(() => mapInputToDb({})).toThrow("Payload inválido");
    });
});
