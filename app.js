// some global config settings
var databaseUrl = "NPI";
var collections = ["users"];
var db = require("mongojs").connect(databaseUrl, collections);
var sys = require("sys"),
        net = require("net");

// initializing global vars
var clients = []; // list containing references to all online users

// add a remove function so we can get rid of clients when they disconnect
Array.prototype.remove = function(e) {
    for (var i = 0; i < this.length; i++) {
	if (e == this[i]) { return this.splice(i, 1); }
    }
};

// heartbreakingly basic client class
function Client(stream) {
    this.name = null;
    this.stream = stream;
}

// create a server bound to port 21483
var server = net.createServer(function(stream) { //'connection' listener

    var client = new Client(stream);
    clients.push(client);

    stream.setTimeout(0);
    stream.setEncoding("utf8");

    stream.addListener("connect", function () {
	stream.write("login:\n");
    });

    stream.addListener("data", function (data) {

	// if we're just logging in, get our user name
	if (client.name == null) {
	    client.name = data.match(/\S+/);
	    stream.write("== Welcome to No Pants Island, " + client.name + " ==\n");
	    clients.forEach(function(c) {
		if (c != client) {
		    c.stream.write(client.name + " has joined.\n");
		}
	    });
	    return;
	}
    });

});

// starts the server listenign on this port
server.listen(21483, function() { //'listening' listener
    console.log('server bound to port 21483');
});


function broadcast(str) {
    console.log("broadcast:" + str);
}

db.users.find(function(err, users) {
    if(err || !users) console.log("No users found.");
    else users.forEach( function(user) {
	console.log(user.name + ' - ' + user.password);
    });
});