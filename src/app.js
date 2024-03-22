const express = require('express')
const router = require('./routes/index')

const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
app.use(router)

const port = process.env.PORT || 3002

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})