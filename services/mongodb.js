import { MongoClient, ObjectId } from 'mongodb'

import Timer from '~~/utils/timer'

const timer = new Timer()

class MongodbService {
    constructor(config){
        this.config = config
        this.client = null
        this.queries = {}

        this.Initialize()
    }

    get Client(){
        return this.client
    }
    get DB(){
        return this.client.db(this.config.database)
    }

    Initialize(){
        let connectionString = `${ this.config.protocol }://`
        if(this.config.user && this.config.pass && this.config.user != '' && this.config.pass != ''){
            connectionString += `${ this.config.user }:${ this.config.pass }@`
        }
        connectionString += `${ this.config.host }`
        if(this.config.port) connectionString += `:${ this.config.port }`
        connectionString += `/${ this.config.database }`

        this.client = new MongoClient(connectionString, this.config.settings)
    }

    async Connect(){
        await this.client.connect()
    }

    CreateQueryKey({
        collection = null,
        filter = {},
        sort = null,
        limit = null,
        skip = null,
        distinct = false,
        cacheKeySuffix = ''
    }){
        const queryKey = `${ JSON.stringify(collection) }_${ JSON.stringify(filter) }_${ JSON.stringify(sort) }_${ limit }_${ skip }_${ distinct }_${ cacheKeySuffix }`
        return queryKey
    }

    GetCachedQuery(queryKey){
        if(this.queries[queryKey] && this.queries[queryKey].queryTime > (timer.Now - this.config.cache.maxMS)){
            return this.queries[queryKey]
        }

        return false
    }

    async Count({
        collection,
        filter = {}
    }){
        if(filter) filter.deleted = false

        return this.DB.collection(collection).countDocuments(filter)
    }

    async Find({
        collection,
        filter = {},
        sort = {},
        distinct = false,
        limit = 0,
        skip = 0,
        nocache = false,
        cacheKeySuffix = ''
    }){
        let queryKey = null
        let cachedQuery = null

        if(!nocache){
            queryKey = this.CreateQueryKey({ collection, filter, sort, limit, skip, distinct, cacheKeySuffix })
            cachedQuery = this.GetCachedQuery(queryKey)
            if(cachedQuery && cachedQuery.result) return JSON.parse(JSON.stringify(cachedQuery.result))
        }

        if(filter && filter._id && typeof filter._id === 'string') filter._id = new ObjectId(filter._id)
        if(filter) filter.deleted = false

        let items = []

        if(distinct){
            items = await this.DB.collection(collection).distinct(distinct, filter)
        }else{
            items = await this.DB.collection(collection)
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
            items = await items.toArray()
        }

        if(!nocache) this.queries[queryKey] = { queryTime: timer.Now, result: JSON.parse(JSON.stringify(items)) }

        return items
    }
    async FindById(collection, id, { nocache } = { nocache: false }){
        return await this.FindOne({ collection, filter: { _id: new ObjectId(id), deleted: false }, nocache })
    }

    async FindOne({
        collection,
        filter,
        nocache = false,
        cacheKeySuffix = ''
    }){
        let queryKey = null
        let cachedQuery = null

        if(!nocache){
            queryKey = this.CreateQueryKey({ collection, filter, cacheKeySuffix })
            cachedQuery = this.GetCachedQuery(queryKey)
            if(cachedQuery) return JSON.parse(JSON.stringify(cachedQuery.result))
        }

        if(filter && filter._id && typeof filter._id === 'string') filter._id = new ObjectId(filter._id)
        if(filter) filter.deleted = false

        let item = await this.DB.collection(collection).findOne(filter)

        if(!nocache) this.queries[queryKey] = { queryTime: timer.Now, result: JSON.parse(JSON.stringify(item)) }

        return item
    }

    async Create({ collection, data }){
        let insertMethod = 'insertOne'
        if(Array.isArray(data)) insertMethod = 'insertMany'

        const result = await this.DB.collection(collection)[insertMethod](data)

        if(result.ops.length == 0) return false
        if(result.ops.length == 1) return result.ops[0]

        return result.ops
    }

    async UpdateById(collection, id, data){
        await this.Update({ collection, query: { _id: new ObjectId(id) }, data })

        return await this.FindById(collection, id)
    }

    async Update({ collection, query, data }){
        return await this.DB.collection(collection).updateMany(query, { $set: data })
    }

    async DeleteById(collection, id, data){
        return await this.Delete({ collection, query: { _id: new ObjectId(id) }, data })
    }

    async Delete({ collection, query, data }){
        return await this.DB.collection(collection).deleteMany(query)
    }
}

export default MongodbService
