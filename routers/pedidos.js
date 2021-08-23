const express = require("express");
const router = express.Router();

// Retorna todo os pedidos
router.get("/", (req, res, next) => {
    res.status(200).send({
        mensagem: "Retorna todos os pedidos"
    });
});

router.post("/", (req, res, next) => {
    const pedido = {
        id_pedido: req.body.id_pedido,
        quantidade: req.body.quantidade
    }
    res.status(201).send({
        mensagem: "Insere um pedido",
        pedidoCriado: pedido
    });
});

router.get("/:id_pedido", (req, res, next) => {
    const id = req.params.id_produto
    res.status(200).send({
        mesagem: "Você descobriu o ID especial",
        id_pedido: id   
    });
});


// EXCLUI UM PEDIDO
router.delete("/", (req, res, next) => {
    res.status(201).send({
        mensagem: "Pedido excluido!"
    });
});


module.exports = router;