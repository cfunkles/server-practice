var fs = require('fs');//fs module from node
var http = require('http');// http module from node
var server = http.createServer(function(req, res) {
	console.log(req.url);
	//request the root
	if (req.url === '/') {
		fs.readFile("Site-Visits.txt", function(err, fileData) {
			if (err) {
				//creates new file if error is thrown meaning the file doesn't exist.
				console.log(err);
				fs.appendFile('Site-Visits.txt', "", function(err) {
					if (err) {
						console.log(err);
						res.end();
					}
					console.log("Site Tracker file created");
					//the file must be read before it can be rewritten, even if it's blank
					fs.readFile('Site-Visits.txt', function(err, fileData) {
						if (err) {
						console.log(err);
						res.end();
						}
						var replacedStr = fileData.toString().replace("", 'This site has been viewed 1 times.');
						//replace nothing with The string showing the first visit
						//replace method does not work on a buffer, needs to be a string
						//replace the entire file with the new data using the replace method.
						fs.writeFile('Site-Visits.txt', replacedStr, function(err) {
							//put back the rewritten data which didn't exist before
							if (err) {
								console.log(err);
								res.end();
							} 
							console.log(replacedStr);
							//log in the server our page visits
							fs.readFile('cats-gifs-adder.html', function(err, data) {
								//read our page that the user is visiting
								if (err) {
									console.log(err);
									res.end();
								}
								//respond back with this data for the user to see
								res.write(data);
								console.log("First time page ever visited!");
								res.end();
							});
						});
					});
				});
			} else {
				fs.readFile('Site-Visits.txt', function(err, fileData) {
				// this happens when the file exisits meaning the page has been visited before
					if (err) {
						console.log(err);
						res.end();
					}
					//adds one to the number in the text file to track page visits
					function changeVisits(fileData) {
						var dataArr = fileData.toString().split(' ');
						var newFile = '';
						var parseIntData = parseInt(dataArr[5]);
						parseIntData += 1;
						dataArr[5] = parseIntData;
						newFile = dataArr.join(' ');
						console.log(newFile);
						return newFile;
					}
					
					//replace only the page visits data in the file
					fs.writeFile('Site-Visits.txt', changeVisits(fileData), function(err) {
						//put the new information back into the file
						if (err) {
						console.log(err);
						res.end();
						}
						//show in the server the page visit info
						fs.readFile('cats-gifs-adder.html', function(err, data) {
							//load the main page response back to the user.
							if (err) {
								console.log(err);
								res.end();
							}
							res.write(data);
							res.end();
						});
					});
				});
			} 
		});
	} else if (req.url === '/Site-Visits.txt') {
		//just show this information to the user, no other data manipulation.
		fs.readFile("Site-Visits.txt", function(err, data) {
			if (err) {
				console.log(err);
				res.end();
			}
			res.write(data);
			res.end();
		});
	} else {
		//respond with this if not correct page.
		res.write('404 Not Found!');
		res.end();
	}
});

server.listen(8000);
console.log("Server started http://localhost:8000");