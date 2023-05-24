const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path  = require('path')

dotenv.config({ path: './.env'});

const app = express();

const conn = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public');

app.use(express.static(publicDirectory));

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));
//Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('view engine', 'hbs');

conn.connect(function(err) {
    if(err) throw err;
    console.log("Mysql Connected...");
})

//Define Routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.listen(5000,()=>{
    console.log("Server started on 5000");
})