const http = require("http");
const app = require("./index");
const port = process.env.PORT || 8081;
const server = http.createServer(app);

const d = new Date();
const hora = d.getHours(); 
const min = d.getMinutes();

server.listen(port, () => {
    console.log("Servidor ativo "+(hora<10 ? "0"+hora : hora)+":"+(min<10 ? "0"+min : min)+" no endereço http://localhost:8081");
});