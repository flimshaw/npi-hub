var databaseUrl = "NPI";
var collections = ["users"];
var db = require("mongojs").connect(databaseUrl, collections);

db.users.find(function(err, users) {
    if(err || !users) colsole.log("No users found.");
    else users.forEach( function(user) {
	console.log(user.name);
    });
});