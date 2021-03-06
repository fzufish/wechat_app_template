
var express = require('express');
var router = express.Router();
var models = require('../models');
var uuid = require("uuid");
var logger = require("../middleware/logger");
var needauth = require("../middleware/needauth");
var discuss = require('../services/discuss');

router.post('/create', needauth, function (req, res) {
    var _obj = {
        discussid: req.pack.req.data.discussid || null,
        listid: req.pack.req.data.listid || null,
        noteid: req.pack.req.data.noteid || null,
        userid: req.pack.req.data.userid || null,
        visitor: req.pack.req.data.visitor || null,
        type: req.pack.req.data.type || null,
        like: req.pack.req.data.like || null,
        lose: req.pack.req.data.lose || null,
        lose_content: req.pack.req.data.lose_content || null,
        sort: req.pack.req.data.sort || null,
        content: req.pack.req.data.content || null,
        ext: req.pack.req.data.ext || null,
    };
    discuss.create(_obj)
        .then(function () {
            req.pack.setMsg({type: 1, data: '创建成功'});
            res.send(req.pack);
        })
        .catch(function (err) {
            req.pack.setStatus(-1);
            req.pack.setMsg({type: 2, data: err.message});
            res.send(req.pack);
        });
});

router.post('/delete', needauth, function (req, res) {
    if (req.pack.auth.power == 0) {
        discuss.delete(req.pack.req.data.discussid)
            .then(function () {

                req.pack.setMsg({type: 1, data: '删除成功'});
                res.send(req.pack);

            })
            .catch(function (err) {
                req.pack.setStatus(-1);
                req.pack.setMsg({type: 2, data: err.message});
                res.send(req.pack);
            });
    } else {
        req.pack.setStatus(2);
        req.pack.setMsg({type: 4, data: '没有操作权限,请联系超级管理员'});
        res.send(req.pack);
    }
});

router.post('/update', needauth, function (req, res) {
    var _obj = {
        discussid: req.pack.req.data.discussid || null,
        listid: req.pack.req.data.listid || null,
        noteid: req.pack.req.data.noteid || null,
        userid: req.pack.req.data.userid || null,
        visitor: req.pack.req.data.visitor || null,
        type: req.pack.req.data.type || null,
        like: req.pack.req.data.like || null,
        lose: req.pack.req.data.lose || null,
        lose_content: req.pack.req.data.lose_content || null,
        sort: req.pack.req.data.sort || null,
        content: req.pack.req.data.content || null,
        ext: req.pack.req.data.ext || null,
    };
    discuss.update(_obj)
        .then(function () {
            req.pack.setMsg({type: 1, data: '更新成功'});
            res.send(req.pack);
        })
        .catch(function (err) {
            req.pack.setStatus(-1);
            req.pack.setMsg({type: 2, data: err.message});
            res.send(req.pack);
        });
});


router.post('/search', needauth, function (req, res) {
    var key = req.pack.req.data.key;
    var value = '%' + req.pack.req.data.value + '%';
    var st = req.pack.req.data.startDatetime || null;
    var et = req.pack.req.data.endDatetime || null;

    var obj = {};
    var obj2 = {};
    obj2['$like'] = value;
    obj[key] = obj2;

    if (st && et) {
        obj2['$between'] = [st, et];
        obj['createdAt'] = obj2;
    }

    models.discuss.findAll({
            where: obj
        }
    ).then(function (data) {
        if (data) {
            req.pack.setResult(data);
            res.send(req.pack);
        } else {
            req.pack.setMsg({type: 4, data: '找不到相应产品信息'});
        }
    }).catch(function (err) {
        req.pack.setStatus(-1);
        req.pack.setMsg({type: 2, data: err.message});
        res.send(req.pack);
    });
});

router.post('/listPage', needauth, function (req, res) {

    var offset = parseInt(req.pack.req.data.offset);
    var limit = parseInt(req.pack.req.data.limit) || 20;
    var st = req.pack.req.data.startDatetime || null;
    var et = req.pack.req.data.endDatetime || null;

    discuss.listPage(offset, limit, st, et)
        .then(function (data) {

            req.pack.setResult(data)
            res.send(req.pack);
        })
        .catch(function (err) {

            req.pack.setStatus(-1);
            req.pack.setMsg({type: 2, data: err.message});
            res.send(req.pack);
        });
});

router.post('/detail', function (req, res) {

    discuss.findOne(req.pack.req.data.discussid)
        .then(function (result) {
            req.pack.setResult(result);
            res.send(req.pack);
        })
        .catch(function (err) {
            req.pack.setStatus(-1);
            req.pack.setMsg({type: 2, data: err.message});
            res.send(req.pack);
        });
});

module.exports = router;