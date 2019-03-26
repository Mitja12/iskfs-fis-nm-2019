var http = require("http").createServer(handler);
var firmata = require("firmata");
var io = require("socket.io").listen(http); 
var fs = require("fs"); 

var zelenaDioda = 8;
var rdecaDioda = 9;
var modraDioda = 10;
var oranznaDioda = 11;


var board = new firmata.Board("/dev/ttyACM0", function(){
                                                         
    console.log("Priklop na Arduino");
    board.pinMode(zelenaDioda, board.MODES.OUTPUT);
    board.pinMode(rdecaDioda, board.MODES.OUTPUT);
    board.pinMode(modraDioda, board.MODES.OUTPUT);
    board.pinMode(oranznaDioda, board.MODES.OUTPUT);
});

function handler(req, res) { 
    fs.readFile(__dirname + "/Naloga-1.html", 
    function (err, data) {                    
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Napaka pri nalaganju html strani.");
        }
    res.writeHead(200);
    res.end(data);
    });
}

http.listen(8080); 

io.sockets.on("connection", function(socket) {
    socket.on("ukazArduinu", function(štUkaza) {
        if (štUkaza == "1") {
            board.digitalWrite(zelenaDioda, board.HIGH); 
        }
        if (štUkaza == "0") {
            board.digitalWrite(zelenaDioda, board.LOW); 
        }
        if (štUkaza == "3") {
            board.digitalWrite(rdecaDioda, board.HIGH); 
        }
        if (štUkaza == "2") {
            board.digitalWrite(rdecaDioda, board.LOW); 
        }
        if (štUkaza == "5") {
            board.digitalWrite(modraDioda, board.HIGH); 
        }
        if (štUkaza == "4") {
            board.digitalWrite(modraDioda, board.LOW); 
        }
        if (štUkaza == "7") {
            board.digitalWrite(oranznaDioda, board.HIGH); 
        }
        if (štUkaza == "6") {
            board.digitalWrite(oranznaDioda, board.LOW); 
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