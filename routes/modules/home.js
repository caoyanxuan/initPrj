const { jsonMaker } = require('../middleware.js');

const funcs = {
    homeGet: (req, res) => {
        res.json(jsonMaker(200, 'home-get', { req: req.query}));
    },
    homePost: (req, res) => {
        res.json(jsonMaker(200, 'home-POST', { req: req.body }));
    }
}
module.exports = [{
    method: 'get',
    url: '/',
    handler: funcs.homeGet
}, {
    method: 'post',
    url: '/',
    handler: funcs.homePost
}];