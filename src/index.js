const express = require('express')
const bodyParser = require('body-parser')
const cokieParser = require('cookie-parser')
const cors = require('cors')

require('dotenv').config({path: __dirname + '/.env'})

const corsOptions = require('./config/cors')
const db = require('./config/database')
const routes = require('./routes')

const app = express()

//connect database
db.connectDatabase()

//cookie parser
app.use(cokieParser())

//config body override
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())

//config cors
app.use(cors(corsOptions))

//routes
routes(app)

//app listen port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
    console.log(`http://localhost:${process.env.PORT}`)
})