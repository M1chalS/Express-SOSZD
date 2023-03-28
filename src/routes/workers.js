const mongo = require("mongodb");
const express = require("express");
const client = require("../db-client-wrapper");
const path = require("path");
const router = express.Router();

const db = client.db("baza_danych");
const pracownicy = db.collection("pracownicy");

const viewsDir = path.join(__dirname, '..', 'views');

router.get("/", (req, res) => {
    res.sendFile(viewsDir + "/index.html");
});

router.get('/dodaj', (req, res) => {
    res.sendFile(viewsDir + "/create.html");
});

router.get('/aktualizacja/:id', async (req, res) => {
    const id = new mongo.ObjectId(req.params.id);
    const pracownik = await pracownicy.findOne({ "_id": id });
    console.log(pracownik);
    res.render(viewsDir + "/update.ejs", { pracownik });
});

router.post('/dodaj', async (req, res) => {
    const { imie, nazwisko, stanowisko } = req.body;

    if (!imie || !nazwisko || !stanowisko) {
        throw new Error("Brak danych!");
    }

    await pracownicy.insertOne({
        imie,
        nazwisko,
        stanowisko
    });

    res.redirect('/wyswietl');
});

router.get('/wyswietl', async (req, res) => {

    let dane;

    if (req.query) {
        const query = req.query;

        if (query.imie) {
            dane = await pracownicy.find({ imie: query.imie }).toArray();
        } else if (query.nazwisko) {
            dane = await pracownicy.find({ nazwisko: query.nazwisko }).toArray();
        } else if (query.stanowisko) {
            dane = await pracownicy.find({ stanowisko: query.stanowisko }).toArray();
        } else {
            dane = await pracownicy.find().toArray();
        }

    }
    res.render(viewsDir + "/list.ejs", { a: dane });
});

router.post("/aktualizuj/:id", async (req, res) => {
    const _id = new mongo.ObjectId(req.params.id);
    const { imie, nazwisko, stanowisko } = req.body;

    if (!imie || !nazwisko || !stanowisko) {
        throw new Error("Brak danych!");
    }

    await pracownicy.updateOne({ _id }, {
        $set: {
            imie,
            nazwisko,
            stanowisko
        }
    });

    res.redirect('/wyswietl');
});

router.post('/usuwanie/:id', async (req, res) => {
    const _id = new mongo.ObjectId(req.params.id);

    await pracownicy.deleteOne({ _id: _id });

    res.redirect('/wyswietl');
});

module.exports = router;