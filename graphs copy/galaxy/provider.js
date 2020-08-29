import Provider from '~~/services/data/provider'

class DataProvider extends Provider {
    constructor(collectionName){
        super(collectionName)
    }
}

const provider = new DataProvider('galaxies')

export default provider