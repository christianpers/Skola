const { create, all } = require("./controller");
const { isAuthenticated } = require("../auth/authenticated");
const { isAuthorized } = require("../auth/authorized");

const routesConfig = function(app) {
    app.post('/users',
       isAuthenticated,
       isAuthorized({ hasRole: ['admin', 'manager'] }),
       create
   );

   // lists all users
   app.get('/users', [
       isAuthenticated,
       isAuthorized({ hasRole: ['admin', 'manager'] }),
       all
   ]);
}

exports.routesConfig = routesConfig;