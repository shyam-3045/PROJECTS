require('dotenv').config()
const express = require('express')
const app = express()
const sql=require('mysql2')
const cookieParser = require("cookie-parser");
const { engine }= require('express-handlebars')
const path = require('path')

const PORT = process.env.PORT || 4500;

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.engine('hbs',engine({extname:'.hbs' , defaultLayout:false}))
app.set('view engine','hbs')
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser());


const con = sql.createConnection({
  host:process.env.HOST,
  user:process.env.DB_USER,
  password:process.env.PASS,
  database:process.env.DB
});



const router = require('./routes/login.js')
app.use('/',router)

app.listen(PORT,()=>
{
  console.log(`Server is running at:http://localhost:${PORT}`)
})
