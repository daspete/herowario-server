import MongoDBService from '~~/services/mongodb'
import databaseConfig from '~~/config/mongodb'

export default class DatabaseProvider {
    constructor(config){
        this.config = config

        this.database = new MongoDBService(databaseConfig)
        try {
            this.database.Connect()
        }catch(err){ console.log('DB connection error', err) }

    }

    async Count(params){
        return this.database.Count({ collection: this.config.collection, ...params })
    }

    async Find(params){
        return this.database.Find({ collection: this.config.collection, ...params })
    }

    async FindById(...params){
        return this.database.FindById(this.config.collection, ...params)
    }

    async FindOne(params){
        return this.database.FindOne({ collection: this.config.collection, ...params })
    }

    async Create(params){
        params.createdAt = new Date()
        params.deleted = false
        return this.database.Create({ collection: this.config.collection, data: params })
    }

    async UpdateById(params){
        params.data.updatedAt = new Date()
        return this.database.UpdateById(this.config.collection, params.id, params.data)
    }

    async Update(params){
        params.data.updatedAt = new Date()
        return this.database.Update({ collection: this.config.collection, ...params })
    }

    async Delete(...params){
        params.data = {
            deletedAt: new Date(),
            deleted: true
        }
        return this.database.Update({ collection: this.config.collection, ...params })
    }

    async DeleteById(id, hardDelete = false){
        if(hardDelete){
            let item = await this.database.FindById(this.config.collection, id)
            await this.database.DeleteById(this.config.collection, id)
            return item
        }


        const updateData = {
            deletedAt: new Date(),
            deleted: true
        }

        return this.database.UpdateById(this.config.collection, id, updateData)
    }
}
