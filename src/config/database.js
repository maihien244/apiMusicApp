const mongoose = require('mongoose')
require('dotenv').config()

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true,
        })
        console.log('Database connected')
    } catch (error) {
        console.log('Database connection failed', error)
        // connectDatabase()
    }
}

module.exports = { connectDatabase }