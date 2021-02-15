/*
 * [controller/window.js]
 * Window Operation
 */

const axios = require('axios')
const express = require('express')
const model = require('../model')
const router = express.Router()

router.post('/create', async (req, resp) => {
    // 区分管理员的方式待定
    const res = await model('window').insert(req.body)
    if(!res) resp.status(400).send('创建失败，请重试')
    else resp.status(200).send('创建成功')
    return
}) // 添加窗户(只能由管理员操作)

router.post('/del', async (req, resp) => {
    const res = await model('window').delete(req.body)
    if(!res) resp.status(400).send('注销失败，请重试')
    else resp.status(200).send('注销成功')
    return
}) // 注销窗户(只能由管理员操作)

router.post('/binding', async (req, resp) => {
    if(!req.body.id || !req.body.password) {
        resp.status(403).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password})
    if(!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const window = await model('window').find({ id: req.body.window_id, token: req.body.token })
    if(!window.length) {
        resp.status(403).send('窗户id或校验码输入错误')
        return
    }
    if(window[0].has_owner) {
        resp.status(403).send('该窗已与现有账号绑定，请先解绑')
        return
    }
    const filter = window[0]
    const update = filter
    update.has_owner = true
    update.owner = req.body.id  
    const res = await model('window').update(filter, update)
    if(!res) resp.status(400).send('绑定失败，请重试')
    else resp.status(200).send('绑定成功')
    return 
}) // 绑定

router.post('/binding', async (req, resp) => {
    if(!req.body.id || !req.body.password) {
        resp.status(403).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password})
    if(!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const window = await model('window').find({ id: req.body.window_id })
    if(!window.length) {
        resp.status(403).send('窗户id或校验码输入错误')
        return
    }
    if(window[0].has_owner) {
        resp.status(403).send('该窗已与现有账号绑定，请先解绑')
        return
    }
    const filter = window[0]
    const update = filter
    update.has_owner = true
    update.owner = req.body.id  
    const res = await model('window').update(filter, update)
    if(!res) resp.status(400).send('绑定失败，请重试')
    else resp.status(200).send('绑定成功')
    return 
}) // 绑定

router.post('/query', async (req, resp) => {
    if(!req.body.id || !req.body.password) {
        resp.status(403).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password})
    if(!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const window = await model('window').find({ id: req.body.window_id })
    if(!window.length) {
        resp.status(403).send('窗户id错误')
        return
    }
    if(!window[0].has_owner || window[0].owner != req.body.id) {
        resp.status(403).send('该窗并未与当前账号绑定')
        return
    }
    const res = {
        name: res[0].name,
        direciton: res[0].direciton,
        auto: res[0].auto,
        open: res[0].open
    }
    resp.status(200).send(res)
    return 
}) // 查询窗户状态

router.post('/settings', async (req, resp) => {
    if(!req.body.id || !req.body.password || !req.body.new_password) {
        resp.status(400).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password})
    if(!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const window = await model('window').find({ id: req.body.window_id })
    if(!window.length) {
        resp.status(403).send('窗户id错误')
        return
    }
    if(!window[0].has_owner || window[0].owner != req.body.id) {
        resp.status(403).send('该窗并未与当前账号绑定')
        return
    }
    const filter = window[0]
    const update = filter
    if(req.body.name) update.name = req.body.name
    if(req.body.direction) update.direciton = req.body.direciton
    if(req.body.auto) update.auto = req.body.auto
    if(req.body.open) update.open = req.body.open
    const res = await model('window').update(filter, update)
    if(!res) resp.status(400).send('设置错误，请重试')
    else resp.status(200).send('设置成功')
}) // 设置朝向、代理、名字

module.exports = router