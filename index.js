const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(express.static("public"))
app.use(function (err, req, res, next){
    console.log(err)
    next(err)
    })
app.get('/', (req, res)=> {
    res.send("Welcome to my app")
})
app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
})

app.get('/movies', (req, res) => {
    let movies = {
        data: ["The Matrix", "Fight Club", "Avatar", "The Godfather", "The Dark Knight", "Pulp fiction", "Inception", "Intersteller", "Forest Gump", "Gladiator"]
    }
    res.send(movies)
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
})