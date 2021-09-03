/*
 * [controller/condition.js]
 * Condition Operation
 */

const axios = require('axios')
const express = require('express')
const model = require('../model')
const router = express.Router()

router.post('/query', async (req, resp) => {
    if (!req.body.id || !req.body.password) {
        resp.status(400).send('登录状态异常')
        return
    }
    const user = await model('user').find({ id: req.body.id, password: req.body.password })
    if (!user.length) {
        resp.status(403).send('登录状态异常')
        return
    }
    const res = await model('condition').find()
    if (!res.length) resp.status(403).send('请求错误，请重试')
    else resp.status(200).send(res[0])
    return
}) // 获取空气质量和天气数据

/*
router.post('/update', async (req, resp) => {
    // 区分管理员的方式待定
    const condition = await model('condition').find()
    if (!condition.length) {
        resp.status(400).send('更新失败，请重试')
        return
    }
    const res = await model('condition').update(condition[0], req.body)
    if (!res) resp.status(400).send('更新失败，请重试')
    else resp.status(200).send('更新成功')
    return
}) // 更新空气质量和天气数据(只能由管理员操作)
*/

module.exports = router