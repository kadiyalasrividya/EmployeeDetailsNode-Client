/**
 * http://usejsdoc.org/
 */
var Client = require('node-rest-client').Client;
var client = new Client();
var jexcel = require('json2excel');
var nodemailer = require('nodemailer');

exports.getEmployee = function(req, res) {

	var grade = req.query.grade;
	// Getting the data
	var path = '';
	if (grade == 'All Grades') {
		path = "http://localhost:5000/api/employees";
	} else {
		path = "http://localhost:5000/api/employees/grade/" + grade;
	}
	client.get(path, function(data, response) {
		var empdata = data.data;

		//generate a object that contains employee data grouped by grade
		var empsGroupedByGrade = {};
		for (var i = 0; i < empdata.length; i++) {
			var grade = empdata[i].grade;
			if (!empsGroupedByGrade[grade]) {
				empsGroupedByGrade[grade] = [];
			}
			empsGroupedByGrade[grade].push(empdata[i]);
		}

		//get the keys to iterate over the array of grouped data
		var keys = Object.keys(empsGroupedByGrade);

		// Prepare sheets array for json2excel variable
		var sheets = [];

		for (var i = 0; i < keys.length; i++) {
			var sheet = {};
			sheet['sheetName'] = keys[i];
			sheet['header'] = {
				'id' : 'id',
				'name' : 'name',
				'email' : 'email'
			};
			var items = [];
			for (var j = 0; j < empsGroupedByGrade[keys[i]].length; j++) {
				var item = {};
				item['id'] = empsGroupedByGrade[keys[i]][j].id;
				item['name'] = empsGroupedByGrade[keys[i]][j].name;
				item['email'] = empsGroupedByGrade[keys[i]][j].email;
				items.push(item);
			}
			sheet['items'] = items;
			sheets.push(sheet);
		}
		//create data variable for json2excel
		var data = {
			filepath : 'C:\\bench\\Sample\\TestingProject\\Files\\Employees3.xlsx',
			sheets : sheets
		}
		jexcel.j2e(data, function(err) {
			console.log('finish');
		});

		//Emailing the excel sheet
		var transporter = nodemailer.createTransport({
			service : 'gmail',
			auth : {
				user : 'kadiyalasrividya@gmail.com',
				pass : 'l3g6@PI.'
			}
		});
		var mailOptions = {
			from : 'kadiyalasrividya@gmail.com',
			to : 'kadiyalasrividya@gmail.com',
			//cc: 'sumeetm@yash.com',
			subject : 'Sending Email using Node.js',
			text : 'C:\\bench\\Sample\\TestingProject\\Files\\Employees3.xlsx',
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		res.render('emp', {
			emps : empsGroupedByGrade
		});
	});
};
