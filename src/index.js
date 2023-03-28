const express = require("express");
const bodyParser = require('body-parser');
const workersRouter = require("./routes/workers");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(workersRouter);

app.listen(4000, () => {
    console.log("Listening on 4000");
});