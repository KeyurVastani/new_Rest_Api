const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://Keyur_Vastani:Keyur_Vastani@cluster0.rh3wt.mongodb.net/bike_require_API', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => {
    console.log('Connect to db!!!');
});

