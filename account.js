/**
 * Created by ouyangfeng on 10/17/15.
 */
var fs = require('fs');
var crypto = require('crypto');

var err_const = require('./error.js');
var util = require('./util.js');
var log = require('./log.js');


/**
 * 生成oauth并写入文件
 * @param uname
 * @param passwd
 */
function gen_oauth(uname, passwd) {

    var string = uname + ":" + passwd + ":" + new Date().valueOf();
    var md5 = crypto.createHash('md5');
    md5.update(string);
    var result = md5.digest('hex');

    var oauth_ref = uname + ":" + passwd + ":" + result + ":" + new Date().valueOf();
    //写入对应该数据
    fs.appendFile(process.argv[3] + "_oauth", oauth_ref + '\n', function (err) {
        if (err)
            throw err;
        log.w("write " + oauth_ref + " to " + process.argv[3] + "_oauth");
    });

    //写入oauth
    fs.appendFile(process.argv[4], result + '\n', function (err) {
        if (err)
            throw err;
        log.w("write " + oauth_ref + " to " + process.argv[4]);
    });

    return result;
}

/**
 * 登录返回token
 * @param req
 * @param res
 * @param params
 */
function login(req, res, params) {

    if (params.uname && params.passwd) {
        var uname = params.uname;
        var passwd = params.passwd;

        if (uname === "" || passwd === "") {
            util.result_client(req, res, { code : 401, msg : "uname or passwd null" });
        } else {

            var account_file = process.argv[3];

            //查看用户名对应当关系文件是否在
            fs.exists(account_file, function (exists) {

                if (exists) {
                    //读取文件
                    fs.readFile(account_file, 'utf8', function (err, data) {
                        //读取文件错误
                        if (err) {
                            util.result_client(req, res, err_const.err_500);
                        } else {
                            var account_json = JSON.parse(data);
                            var result = new Object();
                            var is_found = false;
                            account_json.forEach(function (up) {
                                if (uname === up.uname && passwd === up.passwd) {
                                    var oauth = gen_oauth(uname, passwd);
                                    result.data = oauth;
                                    is_found = true;
                                    return false;
                                }
                            });
                            if (!is_found) {
                                result.code = 401;
                                result.msg = "uname or passwd not found";
                            }
                            util.result_client(req, res, result);
                        }

                    });

                } else {
                    log.e(account_file + " not found");
                    util.result_client(req, res, err_const.err_500);
                }

            });
        }

    } else {
        util.result_client(req, res, err_const.err_400);
    }

}

exports.login = login;

/**
 * 注销
 * @param req
 * @param res
 * @param params
 */
function logout(req, res, params) {

    util.result_client(req, res, { data : true });

}

exports.logout = logout;