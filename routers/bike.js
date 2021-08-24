const router = require('express').Router();
const verify = require('../Auth/verifyLogin');
const Type = require('../model/Type');
const Bike = require('../model/Bike');
const validate = require('../validation/validation');


// create a Bike by using Biketype
router.post('/bike/:typename', verify, async (req, res) => {

    try {

        //Check Correct type
        const name = req.params.typename;
        const type = await Type.find({ name });

        //check the bike type is available or not
        if (type.length == 0) {
            console.log('dsfsdfsf', type);
            return res.status(404).send({ error: 'Bike Type Not Found!!' });
        }

        // check name fields
        if (!req.body.name) {
            return res.send({ error: 'Bike name is Required' });
        } else if (validate.lengthCheck(req.body.name, 3)) {
            return res.send({ error: 'name Min length 3!!!' });
        }


        // check content fields
        if (!req.body.content) {
            return res.send({ error: 'Bike Content is Required' });
        } else if (validate.lengthCheck(req.body.content, 10)) {
            return res.send({ error: 'Content Min length 10!!!' });
        }


        const result = await Bike.findOne({ name: req.body.name });
        if (result) return res.send({ error: 'This bike  Name Alredy Exits!!!' });

        const bike = new Bike({
            name: req.body.name,
            type: type[0].name,
            content: req.body.content,
            createdBy: req.user
        });

        try {
            await bike.save();
            // const bikeResult =await Bike.findOne({name:req.body.name}).select({"name":1,"content":1})

            res.status(201).send({ msg: 'Bike Created Sucessfully', bike });
        } catch (error) {
            res.status(400).send({ msg: 'bike Creation Failed!!', error });
        }

    } catch (error) {
        return res.status(404).send({ error: 'Something Wrong Make sure Pass Correct type value!!!' });
    }


});


// Get All bikes
router.get('/bikes', (req, res) => {
    Bike.find({}, (err, result) => {
        if (err) return res.status(400).send({ error: err });
        res.status(200).send(result);
    });
    // .select({ "name": 1, "content": 1 })

});


//  get most recent regestered bikes 
router.get('/bikes/recent', (req, res) => {

    //for Asc Order 1 and desc order -1
    //set limit => Show number of post
    //ex:- /post/recent?limit=2
    Bike.find().sort({ createdAt: -1 }).limit(parseInt(req.query.limit)).find((err, result) => {
        if (err) return res.status(400).send({ error: err });
        res.status(200).send(result);
    });

});

// get bikes by bike types
router.get('/bike/:typename', (req, res) => {
    const name = req.params.typename;

    Bike.find({ type: name }, (err, result) => {
        if (err) return res.status(400).send({ error: 'Bike Not Found!!' });
        if (result.length == 0) return res.send('this type of bike is not avalable');
        res.status(200).send(result);
    });

});

//edit Bike by bike id
router.patch('/bike/:id', verify, async (req, res) => {

    let reqKeys = Object.keys(req.body);

    if (Object.keys(req.body).length == 0) {
        return res.send('please enter the update value');
    }

    const bikedata = await Bike.find({ _id: req.params.id });
    const bikesKeys = Object.keys(bikedata[0]?.toJSON());

    for (let i of reqKeys.values()) {
        if (!bikesKeys.includes(i)) {
            return res.send(`${i}  field is not exists`);
        }
    }

    if (req.body.name || req.body.name.length >= 0) {
        if (validate.lengthCheck(req.body.name, 3)) return res.status(400).send({ error: ' bike name length min 3 required!!!' });
    }
    if (req.body.content) if (validate.lengthCheck(req.body.content, 10)) return res.status(400).send({ error: 'content length min 6 required!!!' });

    if (req.body.type) {
        try {
            const typeresult = await Type.findById(req.body.type);
            if (!typeresult) return res.status(404).send({ error: 'Type Not Found!!' });
        } catch (error) {
            return res.status(404).send({ error: 'something wents wrong' });
        }
    }
    if (req.body.like) return res.status(400).send({ error: 'Can not update like!!!' });

    const updateBike = {
        ...req.body
    };
    try {
        if (Object.keys(req.body).length == 0) {
            return res.send('please enter the update value');
        }
        else {

            const up = await Bike.findOneAndUpdate({ _id: req.params.id }, updateBike, { new: true });
            if (!up) {
                res.send('you have not authorize to update the bike ');
            }
            res.send({ message: 'your bike is update', up });
        }
    } catch (error) {
        res.send({ error: 'Bike not Updated' });
    }

});



//Delete Bike by bike id
router.delete('/bike/:id', verify, async (req, res) => {

    try {
        // console.log(await Bike.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id }));
        const bike = await Bike.findOne({ _id: req.params.id });
        if (!bike) {
            return res.status(404).send({ error: 'bike id not Found' });
        }
        const bikes = await Bike.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
        if (!bikes) {
            return res.status(404).send({ error: 'you are not authorize to delete the Bike Because this bike is not registered by you' });
        }



        res.send({
            Msg: 'bike Deleted Sucessfully!!!',
            Deletedbike: bike
        });
    } catch (error) {
        res.status(500).send({ error: ' something wents wrong' });
    }
});

module.exports = router;