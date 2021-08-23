const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('../validation/validation');


router.post('/register', async (req, res) => {


    //Check all value
    if (!req.body.email || !req.body.name || !req.body.password || !req.body.phone)
        return res.send({ error: 'All Filed is Required' });

    //Email Format Check

    if (!validate.emailCheck(req.body.email)) return res.status(400).send({ error: 'Enter Correct Email Address!!!' });

    //Password Length Check
    if (validate.strongPasswordCheck(req.body.password)) return res.status(400).send({ error: 'A minimum 8 characters password contains a combination of uppercase and lowercase letter and number are required.' });

    //Name Length Check
    if (validate.lengthCheck(req.body.name, 3)) return res.status(400).send({ error: 'Name length min 3 required!!!' });


    if (validate.numberlengthCheck(req.body.phone, 10) || isNaN(req.body.phone)) return res.status(400).send({ msg: 'Enter valid Mobile Number' });


    //Unique Email check
    const emailCheck = await User.findOne({ email: req.body.email });
    if (emailCheck) return res.status(400).send({ error: 'Email id Alredy Exits!!!' });


    // Unique mobile number 
    // const phoneCheck = await User.findOne({ phone: req.body.phone })
    // if (phoneCheck) return res.status(400).send({ error: 'phone Alredy Exits!!!' })

    //Encrypt Password
    const salt = await bcrypt.genSalt(10);

    const user = new User({
        ...req.body,
        password: await bcrypt.hash(req.body.password, salt)
    });

    try {

        await user.save();
        const userDetail = await User.findOne({ email: user.email }).select({ 'name': 1, 'email': 1, 'phone': 1 });
        res.status(201).send({ msg: 'Registration Sucessfull', userDetail });

    } catch (error) {
        res.status(400).send({ Msg: 'Registration Failed!!!', error });
    }

});

router.post('/login', async (req, res) => {

    //Check email Format
    if (!req.body.email) {
        return res.send({ error: 'email Filed is Required' });
    }
    else if (!validate.emailCheck(req.body.email)) {
        return res.status(400).send({ error: 'Enter Correct Email Address!!!' });
    }
    //check password format
    if (validate.strongPasswordCheck(req.body.password)) return res.status(400).send({ error: 'A minimum 8 characters password contains a combination of uppercase and lowercase letter and number are required.' });



    //Check User Details
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.send({ error: 'Email is not match!!!' });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.send({ error: 'Password not match!!!' });


    const token = jwt.sign({ _id: user._id }, 'LanetDemobikeProject');


    //Set Auth token
    res.header('auth-token', token).send({ msg: 'User Login Successfully!!', token });

});


module.exports = router;