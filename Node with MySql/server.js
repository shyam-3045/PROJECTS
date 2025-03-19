const express = require('express')
const exphbs = require('express-handlebars')// template engine 
const mysql = require ('mysql2')
require('dotenv').config()

const app = express()
PORT = process.env.PORT || 3500;

//middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static('public'))

//template engine
const handlebars = exphbs.create({extname:'.hbs'})
app.engine('hbs',handlebars.engine)
app.set('view engine','hbs')

// database connection
const con= mysql.createPool(
  {
    connectionLimit:10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,


  })
const router =require('./server/routes/student')
app.use('/',router)


app.listen(PORT , ()=>
{
  console.log(`Server is running at http://localhost:${PORT}`)
})