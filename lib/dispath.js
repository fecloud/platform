/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var err_const = require('./error.js');
var util = require('./util.js');
var status = require('./status.js');


var route = {};


route.status = function (req, res, params) {

    status.status(req, res, params);

};

route.uptime = function (req, res, params) {
    status.uptime(req, res, params);
};

route.df = function (req, res, params) {

    status.df(req, res, params);

};

route.start_service = function (req, res, params) {

    status.start_service(req, res, params);

};

route.stop_service = function (req, res, params) {

    status.stop_service(req, res, params);

};

route.check_token = function (req, res, params) {

    um.check_token(req, res, params);

};

route.server_uptime = function (req, res, params) {

    status.server_uptime(req, res, params);

};

route.query_live = function (req, res, params) {

    status.query_live(req, res, params);

};

route.settime = function (req, res, params) {

    status.settime(req, res, params);

};

exports.route = route;

