"use strict";

const db = require("../config/dataBasePG");

//Get datetime

class ClienteController {
  async getCliente(data) {
    try {
      console.log(data)
      let respuesta;
      respuesta= await db
        .any(
          "SELECT nombre, telefono, edad, dni FROM cliente.cliente WHERE dni=$1 ",
          [data]
        );
      return { datos: respuesta };
    } catch (error) {
      console.log(error)
      return {}
    }
  }
}
  
module.exports = ClienteController;
