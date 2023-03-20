//Express
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = 5555;

//MongoDB
const mongo = require("mongodb");
const url = "mongodb://127.0.0.1:27017";

const klient = new mongo.MongoClient(url);

klient.connect((err) => {
    if (err) console.log(`Brak połączenia z serwerem.`);
});

const db = klient.db("baza_danych");
const pracownicy = db.collection("pracownicy");
///////////////////////////////////////////////////

//npm install ejs --save

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.get('/dodaj', (req, res) => {
   res.sendFile(__dirname+"/dodaj.html");
});

app.get('/aktualizacja', (req, res) => {
   res.sendFile(__dirname+"/aktualizacja.html");
});

app.get('/usuwanie', (req, res) => {
   res.sendFile(__dirname+"/usuwanie.html");
});

app.post('/dodaj', (req, res) => {
    console.log(req);
    const { id, im, naz, st } = req.body;
    pracownicy.insertOne({
        id: Number(`${id}`),
        imie: `${im}`,
        nazwisko: `${naz}`,
        stanowisko: `${st}`,
    });
    res.redirect('/wyswietl');
});

app.get('/wyswietl', async (req, res) => {
    let dane = await pracownicy.find().toArray();
    res.render("index.ejs", { a: dane });
});

app.listen(port, () => {
    console.log("Serwer działa");
});