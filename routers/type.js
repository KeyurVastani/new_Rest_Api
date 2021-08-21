const router = require('express').Router();
const Type = require('../model/Type')
const verify = require('../Auth/verifyLogin')
const validate = require('../validation/validation')

// Create New Type

router.post("/type", verify, async (req, res) => {

    //Check All Field value
    if (req.body.name == undefined) return res.send({ error: "Type name required!!!" })

    //Check Length
    if (validate.lengthCheck(req.body.name, 3)) return res.status(400).send({ error: 'Type name length min 3 required!!!' })

    //check unique Type
    const result = await Type.findOne({ name: req.body.name })
    if (result) return res.send({ error: "type Name Alredy Exits!!!" })

    const type = new Type({
        name: req.body.name,
        createdBy: req.user._id
    })

    try {
        await type.save()
        res.status(201).send({ msg: "Type Created Successfully!!!", type })
    } catch (error) {
        res.status(400).send({ error })
    }
})

//Get All type
router.get("/type/", async (req, res) => {
    Type.find({}, (err, result) => {
        if (err) return res.status(400).send({ error: err })
        res.status(200).send({ type: result })
    })
})

module.exports = router