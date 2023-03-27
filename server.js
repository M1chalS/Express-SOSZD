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
    res.sendFile(__dirname + "/index.html");
});

app.get('/dodaj', (req, res) => {
    res.sendFile(__dirname + "/dodaj.html");
});

app.get('/aktualizacja/:id', async (req, res) => {
    const id = new mongo.ObjectId(req.params.id);
    const pracownik = await pracownicy.findOne({ "_id": id });
    console.log(pracownik);
    res.render("aktualizacja.ejs", { pracownik });
});

app.post('/dodaj', (req, res) => {
    console.log(req);
    const { id, im, naz, st } = req.body;
    pracownicy.insertOne({
        imie: `${ im }`,
        nazwisko: `${ naz }`,
        stanowisko: `${ st }`,
    });
    res.redirect('/wyswietl');
});

app.get('/wyswietl', async (req, res) => {

    let dane;

    if(req.query) {
        const query = req.query;

        if(query.imie) {
            dane = await pracownicy.find({imie: query.imie}).toArray();
        } else if(query.nazwisko) {
            dane = await pracownicy.find({nazwisko: query.nazwisko}).toArray();
        } else if(query.stanowisko) {
            dane = await pracownicy.find({stanowisko: query.stanowisko}).toArray();
        } else {
            dane = await pracownicy.find().toArray();
        }

    }
    res.render("index.ejs", { a: dane });
});

app.post("/aktualizuj/:id", async (req, res) => {
    const _id = new mongo.ObjectId(req.params.id);

    const { im, naz, st } = req.body;
    pracownicy.updateOne({ _id }, {
        $set: {
            imie: `${ im }`,
            nazwisko: `${ naz }`,
            stanowisko: `${ st }`,
        }
    });

    res.redirect('/wyswietl');
});

app.post('/usuwanie/:id', (req, res) => {
    const _id = new mongo.ObjectId(req.params.id);

    pracownicy.deleteOne({_id: _id});

    res.redirect('/wyswietl')
});

app.listen(port, () => {
    console.log("Listening on "+port);
});