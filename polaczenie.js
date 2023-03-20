const mongo = require("mongodb");
const url = "mongodb://127.0.0.1:27017";

const klient = new mongo.MongoClient(url);

klient.connect((err) => {
    if (err) console.log(`Brak połączenia z serwerem.`);
});

const db = klient.db("baza_danych");
const pracownicy = db.collection("pracownicy");

//pracownicy.find().forEach((dane, err) => { console.log(dane) });

async function pokaz() {
    let x = await pracownicy.find().toArray();
    console.log(x);
}

pokaz();