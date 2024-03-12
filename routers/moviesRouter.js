const express = require("express")
const router  = express.Router()
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const Movies = require("../models/movieModel");



//const secret  = "secret-thing"
const secret  = process.env.JWT_SECRET


router.use ("/", (req, res, next) => {

    try {
        let token = req.headers["authorization"];
        token = token.replace("Bearer", "").trim();
        let payload = jwt.verify(token, secret);
        const userID = payload.sub; 
        req.id = userID
        next()
    }

    catch (err) {
        console.log(err)
        res.send("you're not authorized to access this end point")
    }


})

router.get ("/", async (req, res) => {

    let allMovies  = await Movies.find(); 
    res.send(allMovies)
}) 

router.post ("/:id/review", async (req, res) => {

    let review  = {
        user: req.id, 
        comment: req.body.comment,
        rate: req.body.rate
    }

    try {

        let movie = await Movies.findById (req.params.id);


        let reviewed = movie.reviews.findIndex (item => item.user == req.id);

        if (reviewed != -1) {
            return res.send("review already exist")
        }

        movie.reviews.push(review);

        let average = movie.reviews.reduce((accum, value)=> {return accum + value.rate / movie.reviews.length }, 0);
        movie.rate = average
        
        await movie.save()

        res.send({success: true})
    }
    catch (err) {
        console.log (err)
        res.send({success: false})
    }
})

router.post ("/toWatchList", async (req, res) => {

    try {
        let user  = await Users.findById(req.id);
        let item = req.body

        let inWatchList = user.watchList.findIndex (item => item.movie == req.body.movie);

        if (inWatchList != -1) {
            return res.send("movie already in watch list")
        }

        user.watchList.push(item)

        await user.save()

        res.send({success: true})
    }
    catch (err) {
        console.log (err)
        res.send({success: false})
    }

})

router.use("/crud", async (req, res, next) => {
    let user = await Users.findById(req.id);

    if (user.isAdmin == true) {
        next()}
    else {    
        res.send("you don't have administrator access")
    }

})

router.post ("/crud/c", async (req, res) => {
    try {
        let newMovie = new Movies(req.body)
        await newMovie.save()
        res.send({success: true})
    }
    catch (err) {
        res.send({success: false})
    }
})

router.get ("/crud/d/:id", async (req, res) => {
    try {
    await Movies.deleteOne({_id: req.params.id});
    res.send({
        success: true
    })
    }
    catch(err) {
        res.send({success: false})
    }
})

router.get ("/crud/r/:id", async (req, res) => {
    try {
        let movie  = await Movies.findById(req.params.id);
        res.send(movie)
    }
    catch (err) {
        res.send({success: false})

    }
})

router.post ("/crud/u/:id", async (req, res) => {
    try{
        let movie  = await Movies.findById(req.params.id);

        for (let i in req.body ) {
            movie[i] = req.body[i]
        }
    
        movie.save()
        res.send({
            success: true 
        })
    }
    catch {
        res.status(400).send("invalid ID")
    }

})



module.exports = router; 
