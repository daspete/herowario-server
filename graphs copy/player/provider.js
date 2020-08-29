import Provider from '~~/services/data/provider'

class DataProvider extends Provider {
    constructor(collectionName){
        super(collectionName)
    }
}

const provider = new DataProvider('players')

export default provider