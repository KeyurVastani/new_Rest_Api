const jwt = require('jsonwebtoken')

const verify = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send({error:'you must to need login!!!'})

    try {
        const verified = jwt.verify(token, 'LanetDemobikeProject')
        req.user = verified;
        next()
    } catch (error) {
        res.status(404).send('Invalid Token!!!')
    }
}

module.exports = verify