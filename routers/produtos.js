const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
            conn.query(
                "SELECT * FROM produto;",
                (error, result, fields) => {
                    if (error) { return res.status(500).send({ error: error}) }
                    const response = {
                        quantidade: result.length,
                        produtos: result.map(prod => {
                            return {
                                id_produto: prod.id_produto,
                                nome: prod.nome,
                                preco: prod.preco,
                                request: {
                                    tipo: "GET",
                                    descricao: "Retorna os detalhes de um produto especifico",
                                    url: "http://localhost:8081/produtos/" + prod.id_produto
                                }
                        }
                        })
                    }
                    return res.status(200).send({response: result});
                }
            )
    })
});

router.post("/", (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if (error) { return res.status(500).send({ error: error})}
        conn.query(
            "insert into produto (nome, preco) values (?,?)",
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                const response = {
                    mensagem: "Produto inserido com sucesso!",
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: "GET",
                            descricao: "Retorna todos os produtos",
                            url: "http://localhost:8081/produtos" 
                        }
                    } 
                }
                return res.status(201).send(response);
            }
        )
    })   
});

router.get("/:idproduto", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
            conn.query(
                "SELECT * FROM produto WHERE idproduto = ?;",
                [req.params.idproduto],
                (error, result, fields) => {
                    if (error) { return res.status(500).send({ error: error}) }
                    
                    if (result.length == 0) {
                        return res.status(404).send({
                            mensage: "Não foi encontrado produto com este ID"
                        });
                    }
                    const response = {
                        produtoCriado: {
                            id_produto: result[0].id_produto,
                            nome: result[0].nome,
                            preco: result[0].preco,
                            request: {
                                tipo: "GET",
                                descricao: "Retorna um produto",
                                url: "http://localhost:8081/produtos" 
                            }
                        } 
                    }
                    return res.status(201).send(response);
                }
            )
    });
});

// ALTERA UM PRODUTO
router.patch("/", (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if (error) { return res.status(500).send({ error: error }) }
        const response = {
            mensagem: "Produto atualizado com sucesso!",
            produtoAtualizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: "GET",
                    descricao: "Retorna todos os produtos",
                    url: "http://localhost:8081/produtos" + req.body.id_produto 
                }
            } 
        }
        return res.status(201).send(response);
        conn.query(
                `UPDATE produto 
                    SET nome = ?,
                        preco = ?
                    WHERE idproduto = ?`,
            [
                req.body.nome, 
                req.body.preco, 
                req.body.idproduto
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem : "Produto alterado com sucesso!",
                });
            }
        )
    }); 
});

router.delete("/", (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
                `DELETE FROM produto WHERE idproduto = ?`, [req.body.idproduto],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem : "Produto removido com sucesso!",
                });
            }
        )
    }); 
});


module.exports = router;