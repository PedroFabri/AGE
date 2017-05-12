var fs = require('fs');
var header, contentLine;
var totalSize = 0;

fs.readFile('./example.json', function(err, data){
	
	if (err) return console.log(err);

	data = JSON.parse(data);

	calculateTotalSize(data, function(total){totalSize = total});

	createHeader(data, function(res){
		if(err) return console.log(err);
		header = res;
		fs.writeFile("./header.txt", header, function(err, suc){
			if (err) console.log(err);
			else console.log("header.txt gravado");
		});
	});

	createLine(data, function(res){
		fs.writeFile('./line.txt', res, function(err, suc){
			if (err) console.log(err);
			else console.log("line.txt gravado");
		})
	});
});


function createHeader(data, callback){
	var position = data.offset;
	var line = "WRITE: sy-uline("+totalSize+")";

	line += ",/" + position + " sy-vline";

	data.columns.forEach(function(col){
		position++;
		//Início da Linha
		line += ", ";
		line += position + "("+col.content.size+") '"+col.header.title+"'";
		if(col.header.centered) line += " CENTERED ";
		if(col.header.hasOwnProperty('color')) line += " COLOR " + col.header.color + ""; 
		//Fim da linha
		position += col.content.size;
		line += ", " + position + " sy-vline"; //Divisor de colunas
	});
	line += ".";
	line += " WRITE:/ sy-uline("+totalSize+").";
	callback(line);
}

function createLine(data, callback){
	var position = data.offset;
	var line = "WRITE: /" + position + " sy-vline";

	data.columns.forEach(function(col){
		position++;
		//Início da Linha
		line += ", ";
		line += position + "("+col.content.size+") "+col.content.variable;
		if(col.header.centered) line += " CENTERED ";
		//Fim da linha
		position += col.content.size;
		line += ", " + position + " sy-vline"; //Divisor de colunas
	});
	line += ".";
	line += " WRITE:/ sy-uline("+totalSize+").";
	callback(line);
}


function calculateTotalSize(data, callback){
	var total = 0;
	data.columns.forEach(function(col){
		total++;
		total += col.content.size;
	});
	callback(total+1);
	
}
