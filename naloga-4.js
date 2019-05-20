var http = require("http").createServer(handler); // "on req" - "handler"
var io = require("socket.io").listen(http); // socket knjižnica
var fs = require("fs"); // spremenljivka za "file system" za posredovanje html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Priklop na Arduino");
    console.log("Omogočimo Pin 0");
    board.pinMode(0, board.MODES.ANALOG); // analogna nožica 0
    console.log("Omogočimo Pin 1");
    board.pinMode(1, board.MODES.ANALOG); // analogna nožica 1
    board.pinMode(8, board.MODES.OUTPUT); // Posamezni pin konfiguriramo, da deluje kot vhod ali izhod
    board.pinMode(9, board.MODES.OUTPUT); // Posamezni pin konfiguriramo, da deluje kot vhod ali izhod
    board.pinMode(10, board.MODES.OUTPUT); // Posamezni pin konfiguriramo, da deluje kot vhod ali izhod
});

function handler(req, res) {
    fs.readFile(__dirname + "/naloga-4.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Napaka pri nalaganju strani.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

var želenaVrednost = 0; // želena vrednost nastavljena s pot.
var dejanskaVrednost = 0; // dejanska vrednost nastavljena s pot.

var status;

http.listen(8080); // strežnik bo poslušal na vratih 8080

board.on("ready", function() {
    
    board.analogRead(0, function(value){
        želenaVrednost = value; // zvezno branje analogne nožice 0
    });
    
    board.analogRead(1, function(value){
        dejanskaVrednost = value; // zvezno branje analogne nožice 1
    });
    
    io.sockets.on("connection", function(socket) {
        socket.emit("messageToClient", "Strežnik priključen, plošča pripravljena.");
        setInterval(sendValues, 40, socket); // na 40ms pošljemo sporočilo klientu
    }); // konec "sockets.on connection"

}); // konec "board.on(ready)""

function sendValues (socket) {
    if (dejanskaVrednost > želenaVrednost - 10 && dejanskaVrednost < želenaVrednost + 10) {
        board.digitalWrite(8, board.LOW);
        board.digitalWrite(9, board.HIGH);
        board.digitalWrite(10, board.LOW);
        console.log("Želeno");
        status = "vredu";
    }
    if (dejanskaVrednost <= želenaVrednost - 10) {
        board.digitalWrite(8, board.HIGH);
        board.digitalWrite(9, board.LOW);
        board.digitalWrite(10, board.LOW);
        console.log("Prenizko");
        status = "nizko";
    }
    if (dejanskaVrednost >= želenaVrednost + 10) {
        board.digitalWrite(8, board.LOW);
        board.digitalWrite(9, board.LOW);
        board.digitalWrite(10, board.HIGH);
        console.log("Previsoko");
        status = "visoko";
    }
    socket.emit("klientBeriVrednosti",
    {
    "želenaVrednost": želenaVrednost,
    "dejanskaVrednost": dejanskaVrednost,
    "status": status
    });    
    
};