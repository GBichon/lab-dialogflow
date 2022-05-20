/* const express = require("express");

const router = express.Router();

const clienteController = require("../public/clienteController");

router.get("/clientes", async (req, res, next) => {
    try {
        const result = await new clienteController().getCliente(req.query.dni);
        return res.status(200).send(result);
    } catch (error) {
        next(error);
    }
    next();
});


module.exports = router; */