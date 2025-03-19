const express = require('express')
const route = express.Router()
const studentController = require('../controllers/student_connection')

route.get('/',studentController.view)

route.get('/adduser',studentController.add)
route.post('/adduser',studentController.save)



module.exports=route