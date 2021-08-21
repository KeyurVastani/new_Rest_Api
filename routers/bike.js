const router = require('express').Router();
const verify = require('../Auth/verifyLogin')
const Type = require('../model/Type')
const Bike = require('../model/Bike')
const validate = require('../validation/validation')


// create Bike
router.post("/bike/:typeId", verify, async (req, res) => {

    try {
        //Check Correct type
        const type = await Type.find({ _id: req.params.typeId })
        if (!type) {
            return res.status(404).send({ error: "Type Not Found!!" })
        }
        // check All fields
        if (req.body.name == undefined || req.body.content == undefined)
            return res.send({ error: "All Filed is Required" })

        //check length
        if (validate.lengthCheck(req.body.name, 3)) return res.send({ error: "name Min length 3!!!" })
        if (validate.lengthCheck(req.body.content, 10)) return res.send({ error: "Content Min length 10!!!" })


        const bike= new Bike({
            name: req.body.name,
            type: type[0]._id,
            content: req.body.content,
            createdBy: req.user
        })

        try {
            await bike.save()
            res.status(201).send({ msg: "Bike Created Sucessfully", type: type[0].name, bike })
        } catch (error) {
            res.status(400).send({ msg: "bike Creation Failed!!", error })
        }

    } catch (error) {
        return res.status(404).send({ error: "Something Wrong Make sure Pass Correct type value!!!" })
    }


})

// Get All bike 
router.get('/bike', (req, res) => {
    Bike.find({}, (err, result) => {
        if (err) return res.status(400).send({ error: err })
        res.status(200).send(result)
    })
    // .select({ "name": 1, "content": 1 })

});


// get Most Recent Bike
router.get('/bike/recent', (req, res) => {

    //for Asc Order 1 and desc order -1
    //set limit => Show number of post
    //ex:- /post/recent?limit=2
    Bike.find().sort({ createdAt: -1 }).limit(parseInt(req.query.limit)).find((err, result) => {
        if (err) return res.status(400).send({ error: err })
        res.status(200).send(result)
    })

});

// Get bike by type
router.get('/bike/:id', (req, res) => {
    const _id = req.params.id

    Bike.find({ type: _id }, (err, result) => {
        if (err) return res.status(400).send({ error: "Bike Not Found!!" })
        res.status(200).send(result)
    })

});

//edit Bike by bike id
router.patch('/bike/:id', verify, async (req, res) => {

    if (req.body.name != undefined) {
        if (validate.lengthCheck(req.body.name, 3)) return res.status(400).send({ error: ' bike name length min 3 required!!!' })
    }
    if (req.body.content != undefined) if (validate.lengthCheck(req.body.content, 10)) return res.status(400).send({ error: 'content length min 6 required!!!' })

    if (req.body.type != undefined) {
        try {
            const typeresult = await Type.findById(req.body.type)
            if (!typeresult) return res.status(404).send({ error: "Type Not Found!!" })
        } catch (error) {
            return res.status(404).send({ error: "Type Not Found!!" })
        }
    }
    if (req.body.like) return res.status(400).send({ error: 'Can not update like!!!' })
    const updateBike = {
        ...req.body
    }
    try {
        await Bike.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, updateBike)
        const updatedBike = await Bike.find({ _id: req.params.id })
        res.send({messahe:"your bike is update",updatedBike})
    } catch (error) {
        res.send({ error: "Bike not Updated" })
    }

})



//Delete Bike by bike id
router.delete('/bike/:id', verify, async (req, res) => {

    try {
        const bike = await Bike.findOneAndDelete({ _id: req.params.id, createdBy: req.user })

        if (!bike) {
            return res.status(404).send({ error: "bike not Found" })
        }

        res.send({
            Msg: "bike Deleted Sucessfully!!!",
            Deletedbike: bike
        })
    } catch (error) {
        res.status(500).send({ error })
    }
})

module.exports = router;