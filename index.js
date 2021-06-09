const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var session = require('express-session');
const app = express();
app.use(session({secret:'XASDASDA'}));
var ssn ;
app.use(bodyParser.urlencoded({ extended: false}));

const movies = [
	{id: 1, name: "The Matrix", genre: "Action", director: "", imageURL: ""},
	{id: 2, name: "Fight Club", genre: "Action", director: "", imageURL: ""},
	{id: 3, name: "Avatar", genre: "Sci Fi", director: "", imageURL: ""},
	{id: 4, name: "The Godfather", genre: "Action", director: "", imageURL: ""},
	{id: 5, name: "The Dark Knight", genre: "Thriller", director: "", imageURL: ""},
	{id: 6, name: "Pulp fiction", genre: "", director: "", imageURL: ""},
	{id: 7, name: "Inception", genre: "Action", director: "", imageURL: ""},
	{id: 8, name: "Intersteller", genre: "Sci Fi", director: "", imageURL: ""},
	{id: 9, name: "Forest Gump", genre: "Comedy", director: "", imageURL: ""},
	{id: 10, name: "Gladiator", genre: "Action", director: "", imageURL: ""}
]
const directors = [
	{id:1,   name: "George Lucas", bio: "", birthYear: 1920, deathYear: null},
	{id:2,   name: "David Fincher", bio: "", birthYear: 1920, deathYear: null},
	{id:3,   name: "Christopher Nolen", bio: "", birthYear: 1920, deathYear: null},
	{id:4,   name: "David Yates", bio: "", birthYear: 1920, deathYear: null},
	{id:5,   name: "Robbin Williams", bio: "", birthYear: 1920, deathYear: 2014}
]

const genre = [
	{id:1,   category: "Pyschoglogical horror", description: "a very horrifying film", Movies: "the shining" },
	{id:2,   category: "Indapendant movie", description: "indie movie", Movies: "Fight Club", },
]

const name = [
	{id:1,   name: "samuel leroy Jackson", bio: "is an american actor", born: "Decmber 21, 1948" },
]

var users =[
	{username: 'admin', password: 'Test1234', fullname: 'Admin', email: 'admin@test.com', roleId: 2},
	{username: 'bob', password: 'Test1234', fullname: 'Bob', email: 'bob@test.com', roleId: 1}
];
app.use(morgan('common'));
app.use(express.static("public"))
app.use(function (err, req, res, next){
    console.log(err)
    next(err)
    })
app.get('/', (req, res)=> {
    res.send("Welcome to my app")
})
app.get("/login",  (req, res) =>{
    ssn=req.session;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h3>Login:</h3><form action="login" method="post">');
    res.write('<p>Username: <input type="text" name="username" placeholder="username"></p>');    
    res.write('<p>Password: &nbsp;<input type="password" name="password" placeholder="password"></p>');
    res.write('<p><input type="submit" value="Login"></p>');
    res.write('</form><a href="/new">Create profile</a>');
    res.end();
});
app.post ("/login",  (req, res) =>{
	const un = req.body.username;
	const pw = req.body.password;
	const user = getUser(un);
	if (user.password==pw)
	{
		ssn=req.session;
        ssn.user=user;
		res.end("logged in");
	}else{
		res.end("invalid loggin");
	}
});
function getUser (un)
{
	for (let i in users)
	{
		if (users[i].username==un)
		{
			return users[i];
		}
	}
}
app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
})

app.post ("/register", (req, res) => {

console.log(req.body)

	const un = req.body.username;
	const pw = req.body.password;
	const nm = req.body.fullname;
	const em = req.body.email;
	
	const user = {
		username: un,
		password: pw,
		fullname: nm,
		email: em
	}
	users.push(user);
	console.log(user)
	res.json(user);
	
})
app.post ("/updateUser", (req, res) => {
	const un = req.body.username;
	const pw = req.body.password;
	const nm = req.body.fullname;
	const em = req.body.email;
	
	const user = {
		username: un,
		password: pw,
		fullname: nm,
		email: em
	}
	users.push(user);
	res.send (user);
})
function getCurrentUser ()
{
	try {
		const user=ssn.user;
		if (user==null){
			//res.end("not logged in");
			return null;
		}
		return user;
	}catch (e){
		return null;
	}
}
app.get('/users', (req, res) => {
	const user = getCurrentUser();
	if (user==null)
	{
		res.end("no logged in user");
	}else if (user.roleId != 2)
	{
		res.end("not authorized");
	}
	else {
		res.send(users);
	}
})
app.get('/directors', (req, res) => {
    res.send(directors)
})


app.get('/genre', (req, res) => {
    res.send(genre)
})
app.get('/movies', (req, res) => {
    res.send(movies)
})

app.get('/name', (req, res) => {
    res.send(movies)
})

app.get('/director/:name', (req, res) => {
	const director = directors.find(({ name })=> name === req.params.name)
	res.json(director); 
  })

app.get('/director/:nm', (req, res) => {
	const nm = req.params.nm;
	console.log ("nm: "+nm);
	const d=getDirector(nm);
	res.send (d);
})
app.get('/movies/:id', (req, res) => {
	const id = req.params.id;
	console.log ("id: "+id);
	const m=getMovie(parseInt(id));
	res.send (m);
})
app.get('/addMovie/:id', (req, res) => {
	const id = req.params.id;
	console.log ("id: "+id);
	const m=getMovie(parseInt(id));
	res.send ("Movie: "+m.name+" Added to your favorites list");
})
app.get('/removeMovie/:id', (req, res) => {
	const id = req.params.id;
	console.log ("id: "+id);
	const m = getMovie(parseInt(id));
	console.log(m)
	res.send("Movie: " + m.name + " removed to your favorites list");
})
app.post('/unregister', (req, res) => {
	res.send("unregister")
});
app.get('/genre/:g', (req, res) => {
	const g = req.params.g;
	console.log ("genre: "+g);
	let data=[];
	for (let i in movies)
	{
		if (movies[i].genre===g)
{
			data.push(movies[i]);
		}
	}
	res.send (data);
})
function getDirector(name){
	for (let i in directors)
	{
		if (directors[i].name===name)
		{
			return directors[i];
		}
	}
}
function getMovie(id)
{
	return movies.filter((movie) => movie.id === id)[0]

}
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
})
