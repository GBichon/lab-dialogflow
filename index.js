require('dotenv').config();
//const routes = require('./config/routes');
const {WebhookClient, Payload} = require('dialogflow-fulfillment');

const clienteController = require("./public/clienteController");


const express = require ('express');

const app = express();
const router = express.Router();

app.use(express.static(__dirname+'/public/'));


app.get("/", function(req, res){
    res.send("holita");
    console.log("hola consola")
})

app.get("/clientes", async (req, res, next) => {
    try {
        
        const result = await new clienteController().getCliente(req.query.dni);
        console.log("El telefono tuyo es: ", result.datos[0].telefono)
        //result.datos[0].telefono
        return res.status(200).send(result);
    } catch (error) {
        next(error);
    }
    next();
});


/**
* on this route dialogflow send the webhook request
* For the dialogflow we need POST Route.
* */
app.post('/webhook', express.json(), function (req, res) {
    // get agent from request
    let agent = new WebhookClient({request: req, response: res})
    // create intentMap for handle intent
    let intentMap = new Map();
    // add intent map 2nd parameter pass function
    intentMap.set('liquidacionCrear',handleWebHookIntent)
    intentMap.set('liquidacionCrear',handleWebhookLiquidacionesGet)
    intentMap.set('Default Welcome Intent',handleWebHookIntent)

    // now agent is handle request and pass intent map
    agent.handleRequest(intentMap)
})

function handleWebHookIntent(agent){
    agent.add("Hola desde liquidacionCrear")
}

async function handleWebhookLiquidacionesGet(agent){
    try {
        console.log("pasa por webhook")
        let DNI=agent.parameters["DNI"];
        let Nombres=agent.parameters["Nombres"];
        const result = await new clienteController().getCliente(DNI);
        if (!result == {}){
          agent.add("El telefono tuyo es: " + result.datos[0].telefono)
        }
        else{
          agent.add("No se ha encontrado un telefono con esta id")
        }
        //Agrega Menu
        const payload = {
            "richContent": [
              [
                {
                  "event": {
                    "parameters": {},
                    "name": "Welcome",
                    "languageCode": "es"
                  },
                  "type": "list",
                  "title": "Volver al menu principal"
                }
              ]
            ]
          }
          agent.add(new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true}));
          return 
    } catch (error) {
        agent.add(error)
    }
}

app.listen('80', function(){
    console.log('server en 80')
})