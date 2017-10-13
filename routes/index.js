
/*
 * GET home page.
 */

exports.index = function(req, res){	
	var Client = require('node-rest-client').Client;	 
	var client = new Client();
	client.get("http://localhost:5000/api/employees/grade", function (data, response) {
	    // parsed response body as js object 
	    console.log(data);
	    res.render('index',{gradesdata:data });   
	});
};