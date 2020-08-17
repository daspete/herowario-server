const LoadContext = (context) => { 
    const items = {}

    context.keys().forEach((key) => { 
        const itemName = key.split('/').reverse()[0].replace('.js', '')
        items[itemName] = context(key).default
    }) 

    return items
}

const materials = LoadContext(require.context('~~/config/game/materials', true, /\.js$/))
const buildings = LoadContext(require.context('~~/config/game/buildings', true, /\.js$/))

const gameConfig = {
    startMaterials: {
        blink: 100,
        stone: 50,
        wood: 50,
        copper: 10
    },
    materials,
    buildings
}

export default () => {
    return JSON.parse(JSON.stringify(gameConfig))
}