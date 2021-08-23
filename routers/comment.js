const router = require('express').Router();
const verify = require('../Auth/verifyLogin');
const Comment = require('../model/Comment');
const Bike = require('../model/Bike');
const validate = require('../validation/validation');

router.post('/bike/:id/comment', verify, async (req, res) => {

    try {
        //Find Bike
        const result = await Bike.findById(req.params.id);
        if (!result) return res.send('bike id is not defined');






        //Check length
        if (!req.body.comment) return res.send('please enter the comment field');
        if (validate.lengthCheck(req.body.comment, 5)) return res.send({ error: 'Comment Min length 5!!!' });

        const commentt = {
            text: req.body.comment,
            postedBy: req.user._id
        };
        await Bike.findByIdAndUpdate(req.params.id, {
            $push: { comments: commentt }
        }, { new: true });

        const comment = new Comment({
            comment: req.body.comment,
            bikeId: result._id,
            CommentBy: req.user
        });

        await comment.save();
        res.status(201).send({
            comment: {
                commentMsg: req.body.comment,
                bike: result
            }
        });
    } catch (error) {
        res.status(400).send({ error: 'bike not found!!!' });
    }
});
module.exports = router;