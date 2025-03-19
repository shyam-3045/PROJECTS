const mysql = require ('mysql2')


const con= mysql.createPool(
  {
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,


  })


exports.view = (req,res)=>
  {
    con.getConnection((err,connection)=>
      {
        if (err) throw err
        connection.query('select * from users',(err,rows)=>{
          connection.release()
          if(!err){
            res.render("home",{rows})
          }else{
            console.log("connection error !")
          }
        })
      })
      
    
  }

exports.add=(req,res)=>
{
  res.render('adduser')
}

exports.save=(req,res)=>
  {
    con.getConnection((err,connection)=>
      {
        if (err) throw err
        const {name,age,city} = req.body

        connection.query('insert into users (name,age,city) values (?,?,?)',[name,age,city],(err,rows)=>{
          connection.release()
          if(!err){
            res.render("adduser",{msg:'User details added sucessfully !!!'})
          }else{
            console.log("connection error !")
          }
        })
      })
  }
  