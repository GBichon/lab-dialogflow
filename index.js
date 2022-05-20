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
        console.log("El telefono tuyo es: ", result.datos[0].telefono)
        //agent.add("El telefono con el dni y nombre ingresado es: "+ result.datos[0].telefono+" Y su dni es: "+ DNI)
        const payload = {
            "richContent": [
              [
                {
                  "event": {
                    "parameters": {},
                    "languageCode": "es",
                    "name": "Liquidacion"
                  },
                  "title": "Mi liquidación",
                  "type": "list"
                },
                {
                  "type": "divider"
                },
                {
                  "title": "Vacaciones",
                  "type": "list",
                  "event": {
                    "name": "Vacaciones",
                    "parameters": {},
                    "languageCode": "es"
                  }
                },
                {
                  "title": "Beneficios",
                  "event": {
                    "parameters": {},
                    "languageCode": "es",
                    "name": "Beneficios"
                  },
                  "type": "list"
                },
                {
                  "event": {
                    "name": "Documentos",
                    "parameters": {},
                    "languageCode": "es"
                  },
                  "type": "list",
                  "title": "Documentos"
                }
              ]
            ]
          }
          
         agent.add(new Payload(agent, JSON.stringify(payload)), { sendAsMessage:true, rawPayload:false })
        return 
    } catch (error) {
        agent.add("error perdon")
    }
}

app.listen('80', function(){
    console.log('server en 80')
})