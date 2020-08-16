const path = require('path')

const rootPath = path.resolve(process.cwd())

// load alias config from jsconfig.json file
const jsConfig = require(rootPath + '/jsconfig.json')
const aliasConfig = jsConfig.compilerOptions.paths
const aliases = {}

// create an object which can be handled by webpack
let aliasKeys = Object.keys(aliasConfig)
for(let i = 0; i < aliasKeys.length; i++){
    let aliasKey = aliasKeys[i].replace('/*', '')
    let aliasPath = aliasConfig[aliasKeys[i]][0].replace('/*', '')
    aliasPath = aliasPath.replace('.', process.cwd())
    aliases[aliasKey] = aliasPath
}

module.exports = {
    webpack: (config, options, webpack) => {
        // set global directory aliases
        config.resolve = {
            alias: aliases
        }

        // config.module.rules.push({
        //     test: /\.vue$/,
        //     loader: 'vue-loader',
        // })

        return config
    }
}