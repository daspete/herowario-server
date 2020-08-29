import DatabaseProvider from '~~/services/database/provider'

export default class Provider {
    constructor(collectionName){
        this.databaseProvider = new DatabaseProvider({ collection: collectionName })
        console.log(`registered ${ collectionName } provider`)
    }

    SetContext(context){
        this.context = context
    }

    async FindById(id, params = {}){
        return this.databaseProvider.FindById(id, params)
    }

    async FindOne(params){
        return this.databaseProvider.FindOne(params)
    }

    async All(){
        return this.databaseProvider.Find()
    }

    async Find(params){
        return this.databaseProvider.Find(params)
    }

    async Create(data){
        return this.databaseProvider.Create(data)
    }

    async UpdateById(id, data){
        return this.databaseProvider.UpdateById({ id, data })
    }

    async DeleteById(id){
        return this.databaseProvider.DeleteById(id)
    }

    async Count(params){
        return this.databaseProvider.Count(params)
    }
}
