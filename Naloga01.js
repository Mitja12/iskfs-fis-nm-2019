var http = require("http").createServer(handler);
var firmata = require("firmata");
var io = require("socket.io").listen(http); // knjižnica za vtičnike
var fs = require("fs"); // knjižnica za delo z datotečnim sistemom ("file system fs")

var zelenaDioda = 8;
var rdecaDioda = 9;
var modraDioda = 10;
var oranznaDioda = 11;


var board = new firmata.Board("/dev/ttyACM0", function(){// ACM (Abstract Control Model)
                                                         // za serijsko komunikacijo z Arduinom (lahko je USB)
    console.log("Priklop na Arduino");
    board.pinMode(zelenaDioda, board.MODES.OUTPUT);
    board.pinMode(rdecaDioda, board.MODES.OUTPUT);
    board.pinMode(modraDioda, board.MODES.OUTPUT);
    board.pinMode(oranznaDioda, board.MODES.OUTPUT);
});

function handler(req, res) { // "handler", ki je uporabljen pri require("http").createServer(handler)
    fs.readFile(__dirname + "/naloga01.html", // povemo, da bomo ob zahtevi ("request") posredovali
    function (err, data) {                    // klientu datoteko primer04.html iz diska strežnika
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Napaka pri nalaganju html strani.");
        }
    res.writeHead(200);
    res.end(data);
    });
}

http.listen(8080); // strežnik bo poslušal na vratih 8080

io.sockets.on("connection", function(socket) {
    socket.on("ukazArduinu", function(štUkaza) {
        if (štUkaza == "1") {
            board.digitalWrite(zelenaDioda, board.HIGH); // zapišemo +5V na p. 13
        }
        if (štUkaza == "0") {
            board.digitalWrite(zelenaDioda, board.LOW); // zapišemo 0V na pin13
        }
        if (štUkaza == "3") {
            board.digitalWrite(rdecaDioda, board.HIGH); // zapišemo +5V na pin 8
        }
        if (štUkaza == "2") {
            board.digitalWrite(rdecaDioda, board.LOW); // zapišemo 0V na pin8
        }
        if (štUkaza == "5") {
            board.digitalWrite(modraDioda, board.HIGH); // zapišemo +5V na p. 12
        }
        if (štUkaza == "4") {
            board.digitalWrite(modraDioda, board.LOW); // zapišemo 0V na pin12
        }
        if (štUkaza == "7") {
            board.digitalWrite(oranznaDioda, board.HIGH); // zapišemo +5V na p. 9
        }
        if (štUkaza == "6") {
            board.digitalWrite(oranznaDioda, board.LOW); // zapišemo 0V na pin9
        }
         if (štUkaza == "9") {
            board.digitalWrite(zelenaDioda, board.HIGH);
            board.digitalWrite(rdecaDioda, board.HIGH);
            board.digitalWrite(modraDioda, board.HIGH);
            board.digitalWrite(oranznaDioda, board.HIGH);
        }
        
        if (štUkaza == "8") {
            board.digitalWrite(zelenaDioda, board.LOW);
            board.digitalWrite(rdecaDioda, board.LOW);
            board.digitalWrite(modraDioda, board.LOW);
            board.digitalWrite(oranznaDioda, board.LOW);
        }
    });
});