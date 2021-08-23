const express = require('express');
const app = express();
require('./dataBase/mongoose');
require('dotenv').config();
const port = process.env.DB_PORT || 4000;
app.use(express.json());

app.use(require('./routers/auth'));
app.use(require('./routers/type'));
app.use(require('./routers/bike'));
app.use(require('./routers/like'));
app.use(require('./routers/comment'));


const authRouter = {
    register: '/register',
    login: '/login',
};
const openRouter = {
    GetAllBikeType: '/types',
    GetAllbikes: '/bikes',
    getBikeByBikeType: '/bike/:typename',
    getMostRecentRegesteredBikes : '/bikes/recent?limit={}',
    getMostLikeBike: '//mostlikebike?limit={}'
};
const privateRouter = {
    createType: '/type',
    createBike: '/bike/:typename',
    editBike: '/bike/:id',
    deleteBike: '/bike/:id',
    likeBike: '/bike/like/:id',
    commentOnBike: '/bike/:id/comment'

};
app.get('*', (req, res) => {
    res.send({ urlError: 'This type of url is not present follow below url pattern', Authintication: authRouter, withoutAuth: openRouter, withAuth: privateRouter });
});
app.post('*', (req, res) => {
    res.send({ urlError: 'This type of url is not present follow below url pattern',Authintication: authRouter, withoutAuth: openRouter, withAuth: privateRouter });
});

app.listen(port, () => {
    console.log('Server is on !!!', port);
});

// .select({ "name": 1, "content": 1 })