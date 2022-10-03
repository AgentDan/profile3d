const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({extended: true}))
// app.use('/3d', require('./routes/3d'))

async function start() {
    try {
        await mongoose.connect("mongodb+srv://dan:admin@myclaster.uhkan.mongodb.net/dmodel?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {console.log(`Server started in port ${PORT} `)}
        )
    }catch (e) {console.log(`My ERROR ${e}`)}
}
start()