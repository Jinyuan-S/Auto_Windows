/*
 * [model.js]
 * connect MongoDB
 * export available model Object
 */

'use strict'

const mongodb = require('mongodb')

const db = "mongodb://localhost:27017/"
const client = new mongodb.MongoClient(db, { useUnifiedTopology: true })

client.connect(err => {
    if (err) throw err
    console.log('# Mongodb Ready')
})

module.exports = (col) => { // col为集合名称
    const collection = client.db('data').collection(col)
    return {
        async insert (doc) {
            try {
                const res = await collection.insertOne(doc)
                return res.result.ok // 1 for success
            } catch { return 0 }
        },
        async delete (filter) {
            const res = await collection.deleteMany(filter)
            return res.result.ok // 1 for success
        },
        async find (filter, opt = {}) {
            return await collection.find(filter, opt).toArray()
        },
        async update (filter, update, upsert = false) {
            const res = await collection.updateOne(filter, { $set: update }, { upsert })
            return res.result.nModified
        }
    }
}