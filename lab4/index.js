require('dotenv').config()
const express = require('express')
const gameRoutes = require('./routes/gameRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use('/game', gameRoutes)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})