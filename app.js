const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const csv = require('csvtojson');
const ejs = require("ejs");
const { Db } = require("mongodb");
const { Schema } = mongoose;

const app = express()

app.set('view engine', 'ejs');

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/test');
}


const dataSchema = new Schema({
    name: String,
    title: String,
    email: String

});

const Data = mongoose.model('Data', dataSchema);


app.get("/", (req, res) => {
    res.render("index")
});

app.post("/", (req, res) => {
    const name = req.body.name;
    const tile = req.body.title;
    const email = req.body.email;
    const csvFilePath = req.body.file;

    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            
            jsonObj.map((element, index) => {
                // console.log(element.Name);
                index = new Data({ name: element.Name, email: element.Email, title: element.Title });
              index.save();
            });
        })

    res.render("index");
})

app.listen(3000, (req, res) => {
    console.log("Server running on port 3000");

})