#!/usr/bin/env nodejs

/**
 * Created by ouyangfeng on 10/17/15.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');
process.pid

var log = require('./log.js');
var util = require('./util.js');
var err_const = require('./error.js');
var route = require('./dispath.js').route;


var port = 0;

function start_service() {

    http.createServer(function (req, res) {

            log.d('url:' + req.url);
            var params = url.parse(req.url, true).query;
            if (params && params.action) {
                if (route[params.action]) {
                    route[params.action].call(route, req, res, params);
                } else {
                    util.result_client(req, res, err_const.err_404);
                }
            } else {
                util.result_client(req, res, err_const.err_400);
            }

        }
    ).listen(port, '127.0.0.1');

    var pid_path = __dirname + "/platform.pid"
    if (process.argv.length >= 6) {
        pid_path = process.argv[5];
    }
    //写入pid
    fs.appendFile(pid_path, "" + process.pid, function (err) {
        if (err)
            throw err;
        log.w("write pid "+ process.pid + " " + pid_path);
    });
    log.w('platform service running at http://127.0.0.1:' + port);

}

if (process.argv.length < 5) {
    console.error("Uage: platform <port> <accounts> <oauth> [pid path]");
} else {
    port = process.argv[2];
    start_service();
}
