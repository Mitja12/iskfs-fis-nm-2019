var http = require("http").createServer(handler); 
var io = require("socket.io").listen(http); 
var fs = require("fs"); 
var firmata = require("firmata"); 

console.log("Zagon aplikacije");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Povezava na Arduino");
    console.log("Aktiviramo Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); 
    console.log("Omogočimo Pin 2 kot vhod");
    board.pinMode(2, board.MODES.INPUT);
});

function handler(req, res) {
    fs.readFile(__dirname + "/primer-8.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Napaka pri nalaganju html strani.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

http.listen(8080);


var pošljiVrednostPrekoVtičnika = function(){}; 

board.on("ready", function(){

io.sockets.on("connection", function(socket) {
    socket.emit("sporočiloKlientu", "Strežnik povezan, Arduino pripravljen.");
    
    pošljiVrednostPrekoVtičnika = function (value) {
        io.sockets.emit("sporočiloKlientu", value);
    }
    
}); 

var timeout = false;
var zadnjaPoslana = null;
var zadnjaVrednost = null;


board.digitalRead(2, function(value) { 
    if (timeout !== false) { 
	   clearTimeout(timeout); 
	   console.log("Timeout je postavljen na false");
    }
    timeout = setTimeout(function() {
    
        console.log("Timeout je postavljen na true");
        timeout = false;
        if (zadnjaVrednost != zadnjaPoslana) { 
        	if (value == 0) {
                board.digitalWrite(13, board.LOW);
                console.log("Vrednost = 0, LED izklopljena");
                pošljiVrednostPrekoVtičnika(0);
            }
            else if (value == 1) {
                board.digitalWrite(13, board.HIGH);
                console.log("Vrednost = 1, LED prižgana");
                pošljiVrednostPrekoVtičnika(1);
            }

        }

        zadnjaPoslana = zadnjaVrednost;
    }, 5); // izvedemo po 50ms
                
    zadnjaVrednost = value;
    
}); 

}); 