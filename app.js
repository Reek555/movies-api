const express = require('express'); 
const app = express();
const authRouter = require('./routers/authRouter')
const moviesRouter = require ("./routers/moviesRouter")
require("dotenv").config()



app.use(express.json()); 


app.get('/home', (req, res) => {
    res.send("welcom to home page!")
})

app.use("/api/auth", authRouter)
app.use("/api/movies", moviesRouter)



app.listen(process.env.PORT || "3000", () =>{console.log ('server is running')})

