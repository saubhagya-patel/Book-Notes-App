import express from "express";
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";
import router from "./routes/router.js"

const app=express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/book",router)
import { getAllBooks } from "./controllers/functions.js";

let book=[];

app.get("/",async (req,res)=>{
    book = await getAllBooks();
    res.render("index.ejs",{
        bookInfo: book,
    });
})

app.get("/features",(req,res)=>{
    res.render("features.ejs");
})

app.listen(port,()=>{
    console.log(`Server is listening at http://localhost:3000`);
})