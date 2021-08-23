const validator = require('validator');


const emailCheck = (email) => {
    if (validator.isEmail(email)) return true
}

const lengthCheck = (checkString, minLength) => {
    if (checkString.length < parseInt(minLength)) return true
}
const NumberlengthCheck = (checkNo, Length) => {

    if (checkNo.toString().length != parseInt(Length)) return true
}
module.exports = {
    emailCheck,
    lengthCheck,
    NumberlengthCheck
}


