const express = require('express')
const app = express()

const dotenv = require('dotenv')
const cors = require('cors')
const router = require('./routes/index')
const connectDB = require('./config/db')

dotenv.config()

const port = process.env.PORT

app.use(express.json()) // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB()
.then(() => {
  // Start the server only after successful DB connection
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})
.catch(err => console.log(err));

// http://localhost:3000/api
app.use(cors()) 
app.use("/api", router)
