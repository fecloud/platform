var os = require('os')
var exec = require('child_process').exec,
    child;
var fs = require('fs');
var url =require('url');

var err_const = require('./error.js');
var util = require('./util.js');


/**
 * 所有服务的运行状态
 */
function status(req, res, params) {

    var result = new Object();

    var service_s = new Object();

    child = exec("ps -ef",
        function (error, stdout, stderr) {
            var out = stdout;
            if (out && out != '') {

                //查询所有服务的状态
                if (out.indexOf('filemanager') > 0) {
                    service_s.filemanager = true;
                }

                if (out.indexOf('bdsync') > 0) {
                    service_s.bdsync = true;
                }

                if (out.indexOf('bddown') > 0) {
                    service_s.bddown = true;
                }

                if (out.indexOf('platform') > 0) {
                    service_s.platform = true;
                }

                if (out.indexOf('photos') > 0) {
                    service_s.photos = true;
                }

                if (out.indexOf('vlserver') > 0) {
                    service_s.vlserver = true;
                }

                if (out.indexOf('vlrtmp') > 0) {
                    service_s.vlrtmp = true;
                }

            }
            service_s.arch = process.arch;
            service_s.platform = process.platform;
            service_s.version = process.version;
            service_s.uptime = process.uptime();
            service_s.core = os.cpus().length;
            service_s.network = os.networkInterfaces();
            result.data = service_s;
            util.result_client(req, res, result);

        });

}

exports.status = status;

/**
 * 服务器负载
 */
function uptime(req, res, params) {

    var result = new Object();

    child = exec("uptime",
        function (error, stdout, stderr) {
            var out = stdout;
            if (out && out != '') {
                var arr = out.match(/\d+\.+\d+/g);
                var obj = new Object();
                if (arr != null) {
                    obj.load = arr.join(" ");
                }
                var server_time = out.match(/(\d\d:)+\d{2}/g);
                obj.server_time = server_time[0];
                result.data = obj;
            }else {
                result = err_const.err_500;
            }
            util.result_client(req, res, result);

        });

}

exports.uptime = uptime;


/**
 * 查看磁盘空间
 * @param req
 * @param res
 * @param params
 */
function df(req, res, params) {

    var result = new Object();

    child = exec("df -h | grep " + params.value + " | head -n 1", function (error, stdout, stderr) {
        var out = stdout;
        if (out && out != '') {
            var arr = out.split(" ");
            var re_arr = [];
            if (null != arr) {
                arr.forEach(function (a) {
                    if (a != '') {
                        re_arr.push(a);
                    }
                });
                result.data = re_arr;
            }
        } else {
            result = err_const.err_500;
        }
        util.result_client(req, res, result);

    });

}

exports.df = df;

/**
 * 启动服务
 * @param req
 * @param res
 * @param params

function start_service(req, res, params) {

    var result = new Object();

    var cmd = "sudo service " + params.values + " start";
    if (params.sub) {
        cmd = cmd + " " +  params.sub;
    }

    child = exec(cmd, function (error, stdout, stderr) {

        if (error !== null) {
            util.error = err_const.err_500;
        }else {
            util.debug(stdout);
            result.data = true;
        }
        util.result_client(req, res, result);

    });

}

exports.start_service = start_service;

/**
 * 停止服务
 * @param req
 * @param res
 * @param params

function stop_service(req, res, params) {

    var result = new com.web_result();

    var cmd = "sudo service " + params.values + " stop";
    if (params.sub) {
        cmd = cmd + " " +  params.sub;
    }

    util.debug("cmd:" + cmd);

    child = exec(cmd, function (error, stdout, stderr) {

            if (error !== null) {
                util.error = err_const.err_500;
            }else {
                util.debug(stdout);
                result.data = true;
            }
            util.result_client(req, res, result);

        });

}

exports.stop_service = stop_service;
*/

/**
 * 服务器运行时间
 * @param req
 * @param res
 * @param params
 */
function server_uptime(req, res, params) {

    var result = new Object();

    child = exec("uptime | awk '{print $3}'",
        function (error, stdout, stderr) {
            var out = stdout;
            if (out && out != '') {
                var arr = out.replace(',', "").replace("\n", "");
                result.data = arr;
            }else {
                result = err_const.err_500;
            }
            util.result_client(req, res, result);

        });

}

exports.server_uptime = server_uptime;

/**
 * 查询rtmp与hls地址
 * @param req
 * @param res
 * @param params
 */
function query_live(req, res, params) {

    fs.readFile('/var/run/liveurl', function (err, data) {

        var result = new Object();

        if (err) {
            result = err_const.err_500;
        }else  {
			var str = data.toString().replace('\n','');
			
            result.data = url.parse(str).pathname;
        }
        util.result_client(req, res, result);

    });

}

exports.query_live = query_live;
