const routeAdminNews = require('./admin/news_router');
module.exports = function route(app) {
    //admin
    app.use(routeAdminNews);
    //main
}