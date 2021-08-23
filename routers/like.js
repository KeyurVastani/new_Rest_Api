const router = require('express').Router();
const Like = require('../model/Like')
const verify = require('../Auth/verifyLogin')
const Bike = require('../model/Bike')


// like the  Bike

router.post("/bike/like/:id", verify, async (req, res) => {
    try {
        const result = await Bike.findById({ _id: req.params.id })
        if(!result) return res.send("bike id is not defined")

        const like = new Like({
            likedBy: req.user,
            bikeId: result._id
        })
        const updateLike = {
            like: result.like + 1
        }
        try {
            const checkLike = await Like.findOne({ bikeId: req.params.id, likedBy: req.user })
            if (checkLike) return res.status(400).send({error: "you are already liked"})

            await Bike.findOneAndUpdate({ _id: result._id }, updateLike)
            const UpdatedLike = await Bike.find({ _id: req.params.id })
      

            await like.save()
            res.send({
                msg: "bike Liked Successfully!!",
                likedBike: {
                    LikeID: like._id, bikename: result.name, totalLike: UpdatedLike[0].like
                }
            })
        } catch (error) {
            res.send({ error: "Like not Updated" })
        }

    }
    catch (error) {
        res.status(404).send({ error: "Bike Not Found!!!" })
    }
})

//mostlike Bike
router.get("/mostlikebike", async (req, res) => {

    //limit => number of bike
    Bike.find().sort({ like: -1 }).limit(parseInt(req.query.limit)).find((err, result) => {
        if (err) return res.status(400).send({ error: err })
        res.status(200).send(result)
    })
})


module.exports = router