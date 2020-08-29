import GalaxyProvider from '~~/graphs/galaxy/provider'
import PlanetProvider from '~~/graphs/planet/provider'
import UserProvider from '~~/graphs/user/provider'
import PlayerProvider from '~~/graphs/player/provider'
import SpaceshipProvider from '~~/graphs/spaceship/provider'
import GameProvider from '~~/graphs/game/provider'

import faker from 'faker'

import HashPassword from '~~/utils/HashPassword'
import { ObjectId } from 'mongodb'

const planetRange = 100000

class Seeder {
    constructor(){

    }

    async CreateGalaxy({ planets }){
        return await GalaxyProvider.Create({
            name: faker.random.word(),
            planets: planets.map((planet) => {
                return new ObjectId(planet._id)
            })
        })
    }

    async CreatePlanets(planetCount){
        const planets = []

        for(let i = 0; i < planetCount; i++){
            planets.push(await this.CreatePlanet())
        }

        return planets
    }

    async CreatePlanet(){
        return await PlanetProvider.Create({
            name: faker.random.word(),
            size: faker.random.number(150, 350),
            position: {
                x: faker.random.number(-planetRange, planetRange),
                y: faker.random.number(-planetRange, planetRange),
                z: faker.random.number(-planetRange, planetRange),
            }
        })
    }

    async CreateUser(){
        return await UserProvider.Create({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            gender: faker.random.number(0, 1) == 1 ? 'male' : 'female',
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await HashPassword('123456')
        })
    }

    async CreatePlayer({ user, spaceship }){
        return await PlayerProvider.Create({
            name: faker.random.word(),
            user: new ObjectId(user._id),
            planets: [],
            spaceships: [
                new ObjectId(spaceship._id)
            ]
        })
    }

    async CreateSpaceship(){
        return await SpaceshipProvider.Create({
            name: faker.random.word(),
            position: {
                x: faker.random.number(-planetRange * 0.5, planetRange * 0.5),
                y: faker.random.number(-planetRange * 0.5, planetRange * 0.5),
                z: faker.random.number(-planetRange * 0.5, planetRange * 0.5),
            } 
        })
    }

    async CreateGame({ galaxy, player }){
        return await GameProvider.Create({
            name: faker.random.word(),
            galaxy: new ObjectId(galaxy._id),
            players: [
                new ObjectId(player._id)
            ]
        })
    }
}



const Start = async () => {
    const seeder = new Seeder()
    
    const planets = await seeder.CreatePlanets(50)
    const galaxy = await seeder.CreateGalaxy({ planets })

    const user = await seeder.CreateUser()

    const spaceship = await seeder.CreateSpaceship()
    
    const player = await seeder.CreatePlayer({ user, spaceship })

    const game = await seeder.CreateGame({ galaxy, player })

    console.log(game)
    process.exit(0)
}


Start()