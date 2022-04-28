const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const csv = require('csvtojson');
const ejs = require("ejs");
const { Schema } = mongoose;

const app = express()

app.set('view engine', 'ejs');

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/clientData');
}


const inputDataSchema = new Schema({
    name: String,
    title: String,
    email: String
});

const csvDataSchema = new Schema({
    Name: String,
    Title: String,
    Email: String,
    Linkedin: String,
    Company: String
});

const InputData = mongoose.model('InputData', inputDataSchema);
const FileData = mongoose.model('FileData', csvDataSchema);


app.get("/", (req, res) => {
    res.render("index")
});

app.post("/", (req, res) => {
    const inputName = req.body.inputName;
    const inputTitle = req.body.inputTitle;
    const inputEmail = req.body.inputEmail;
    const csvFilePath = req.body.file;

    const FileData1 = new InputData({
        name: inputName,
        title: inputTitle,
        email: inputEmail
    });
    FileData1.save();

    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {

            jsonObj.map((element, index) => {
                // console.log(element.Name);
                index = new FileData({
                    Name: element.Name,
                    Email: element.Email,
                    Title: element.Title,
                    Linkedin: element.Linkedin,
                    Company: element.Company
                });
                index.save();
            });
        });

    res.render("submit");
});

app.get("/resubmit", (req, res) => {
    res.render("index")
})

app.listen(3000, (req, res) => {
    console.log("Server running on port 3000");

})