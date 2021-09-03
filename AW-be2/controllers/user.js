/*
 * [controller/user.js]
 * User Operation
 */

const axios = require('axios')
const express = require('express')
const model = require('../model')
const router = express.Router()

router.post('/login', async (req, resp) => {
    if (!req.body.id || !req.body.password) {
        resp.status(400).send('参数错误')
        return
    }
    const res = await model('user').find({ id: req.body.id, password: req.body.password })
    if (!res.length) resp.status(403).send('用户名或密码错误')
    else resp.status(200).send('登录成功')
    return
}) // 登录

router.post('/register', async (req, resp) => {
    if (!req.body.id || !req.body.password) {
        resp.status(400).send('登录状态异常')
        return
    }
    const record = await model('user').find({ id: req.body.id })
    if (record.length) {
        resp.status(403).send('用户名已存在')
        return
    }
    else {
        now = {
            id: req.body.id,
            password: req.body.id,
            windows: [],
            perference: {
                AQI: 50,
                TEM: 50,
                PRE_TEM: 23
            },
        }
        const res = await model('user').insert(now)
        if (res) resp.status(200).send('注册成功，请重试')
        else resp.status(403).send('注册失败')
        return
    }
}) // 注册

router.post('/change_password', async (req, resp) => {
    if (!req.body.id || !req.body.password) {
        resp.status(400).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password })
    if (!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const filter = { id: req.body.id, password: req.body.password }
    const update = { id: req.body.id, password: req.body.new_password }
    const record = await model('user').find(filter)
    if (!record.length) {
        resp.status(403).send('原密码错误')
        return
    }
    else {
        const res = await model('user').update(filter, update)
        if (!res) resp.status(400).send('修改失败，请重试')
        else resp.status(200).send('修改成功')
        return
    }
}) // 更改密码

router.post('/preference', async (req, resp) => {
    if (!req.body.id || !req.body.password) {
        resp.status(400).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password })
    if (!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const filter = { id: req.body.id }
    const update = req.body
    const res = await model('user').update(filter, update)
    if (!res) resp.status(400).send('修改失败，请重试')
    else resp.status(200).send('修改成功')
    return
}) // 设置偏好

router.post('/get_preference', async (req, resp) => {
    if (!req.body.id || !req.body.password) {
        resp.status(400).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password })
    if (!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const filter = { id: req.body.id }
    const update = req.body
    const res = await model('user').update(filter, update)
    if (!res) resp.status(400).send('修改失败，请重试')
    else resp.status(200).send('修改成功')
    return
}) // 设置偏好

router.post('/query', async (req, resp) => {
    if (!req.body.id || !req.body.password) {
        resp.status(403).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password })
    if (!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const res = await model('user').find({ id: req.body.id, password: req.body.password })
    if (!res.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const now = await model('window').find({ owner: req.body.id })
    for (var i = 0; i < now.length; ++i) {
        now[i].device_id = 'Secret';
        now[i].api_key = "Secret";
    }
    resp.status(200).send({ window: now, preference: res[0].preference })
    return
}) // 查询窗户

module.exports = router
