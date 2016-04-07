

module.exports = function (app) {
    require('../api/dashboards')(app);
    require('../api/richtexts')(app);
    require('../api/todos')(app);
}