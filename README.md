Using MySQL, Express, and Node.js (MEAN) sample app
Updated on August, 2019 by Nino Narido
For this tutorial we'll be doing something a little different, instead of developing applications with PHP we'll be creating a login system with Node.js, Express, and MySQL.
The Basic and Advanced packages include additional features and a download link to the source code.
What you will learn in this Tutorial
1.	Establishing a connection to a MySQL database and selecting rows using MySQL queries.
2.	Creating GET and POST requests with Node.js and Express.
3.	Sending and receiving data from the client using Node and Express.
4.	Creating session variables for clients, this will determine if a user is logged in or not.
Why create a login system with Node.js over something like PHP?
Node.js is a powerful open-source server environment using JavaScript as its core scripting language, Node.js is still fairly new to the web, web developers around the world are using it more and more each year, some say Node.js is the future for websites and applications.
Node.js's package manager already has over 450,000 packages available for you to download, those numbers alone prove how fast it's growing.
If you are familiar with JavaScript, you will enjoy developing applications with Node.js.
Unlike PHP, Node.js does not require Apache or Nginx, Node.js is its own environment.
Requirements
•	MySQL Server
•	Node.js
•	Express - Install with command: npm install express.
•	Express Sessions - Install with command: npm install express-session.
•	MySQL for Node.js - Install with command: npm install mysql.
File Structure
\-- nodelogin
  |-- login.html
  |-- login.js
Getting Started
Create a new directory called nodelogin, you can create this anywhere on your computer.
Run the command: npm init from inside the directory, it will prompt us to enter a package name, enter: login.
When it prompts to enter the entry, point enter login.js.
Now we need to install the packages listed in the requirements, while still in the command line run the commands listed in the requirements above.
We should now have a new directory called: node_modules with all the modules installed.




Creating the Login System
Create a new file called: login.html.
login.html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Login Form Tutorial</title>
		<style>
		.login-form {
			width: 300px;
			margin: 0 auto;
			font-family: Tahoma, Geneva, sans-serif;
		}
		.login-form h1 {
			text-align: center;
			color: #4d4d4d;
			font-size: 24px;
			padding: 20px 0 20px 0;
		}
		.login-form input[type="password"],
		.login-form input[type="text"] {
			width: 100%;
			padding: 15px;
			border: 1px solid #dddddd;
			margin-bottom: 15px;
			box-sizing:border-box;
		}
		.login-form input[type="submit"] {
			width: 100%;
			padding: 15px;
			background-color: #535b63;
			border: 0;
			box-sizing: border-box;
			cursor: pointer;
			font-weight: bold;
			color: #ffffff;
		}
		</style>
	</head>
	<body>
		<div class="login-form">
			<h1>Login Form</h1>
			<form action="auth" method="POST">
				<input type="text" name="username" placeholder="Username" required>
				<input type="password" name="password" placeholder="Password" required>
				<input type="submit">
			</form>
		</div>
	</body>
</html>
The login form will look like this:
http://localhost:3000/

This is just a basic login form design we'll use for our login system, the method for the form is set to POSTand the action is set to auth, the form data will be sent to our node server using this method.
Now we can go ahead and create our Node.js application, create a new file called: login.js, open the file with your favorite code editor.
We need to include the packages in our Node.js application, create the following variables and require the modules:

var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
We now need a database to connect to, run the below SQL statement either with command prompt/console or your preferred MySQL Editor.
CREATE DATABASE IF NOT EXISTS `nodelogin` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `nodelogin`;

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com');

ALTER TABLE `accounts` ADD PRIMARY KEY (`id`);
ALTER TABLE `accounts` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
This will create a database with the name: nodelogin and with the table: accounts, it will also insert a test account with both the username and password being: test.
We can now connect to our database with the following code:
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});
Remember to change the connection details to your own.
Express is what we'll use for our web applications, this includes packages useful in web development, such as sessions and handling HTTP requests, to initialize it we can do:
var app = express();
We now need to let Express know we'll be using some of its packages:
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
Make sure to change the secret code for the sessions, the sessions package is what we'll use to determine if the user is logged-in, the bodyParser package will extract the form data from our login.html file.
We now need to display our login.html file to the client:
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});
When the client connects to the server the login page will be displayed, the server will send the login.htmlfile.
We need to now handle the POST request, basically what happens here is when the client enters their details in the login form and clicks the submit button, the form data will be sent to the server, and with that data our login script will check in our MySQL accounts table to see if the details are correct.


app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
What happens here is we first create the POST request in our script, our login form action is to: auth so we need to use that here, after, we create two variables, one for the username and one for the password, we then check to see if the username and password exist, if they are we query our MySQL table: accounts and check to see if the details exist in the table.
If the result returned from the table exists we create two session variables, one to determine if the client is logged in and the other will be their username.
If no results are returned we send to the client an error message, this message will let the client know they've entered the wrong details.
If everything went as expected and the client logs in they will be redirected to the home page.
The home page we can handle with another GET request:
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
Our web application needs to listen on a port, for testing purposes we'll use port 3000:
app.listen(3000);
And to run our new web application we can run the following command: node login.js in command prompt/console, this will start the server, if we enter the address: http://localhost:3000/ it should display our login form.
Full login.js Source


var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);


Conclusion
That's about all we need to do for a basic login system, remember this is only a basic solution, I wouldn't recommend using it for production purposes, I recommend you look into more Node.js modules, for example, the password field in this tutorial are not hashed, it requires a separate package.
I hope you've enjoyed this tutorial, don't forget to like, follow, and share this article.
Enjoy coding!
- Prof. Nino Narido, MIS
"# codeless" 
