

module.exports = function (app) {
    require('../api/dashboards')(app);
    require('../api/richtexts')(app);
    require('../api/todolists')(app);
    require('../api/mindmaps')(app);
}