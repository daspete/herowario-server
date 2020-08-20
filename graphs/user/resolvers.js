import bcrypt from 'bcrypt'

import { AuthenticationError, UserInputError } from 'apollo-server-express'

import Authorize from '~~/services/authorize'

import CreateJWTToken from '~~/utils/CreateJWTToken'
import HashPassword from '~~/utils/HashPassword'
import ValidateEmail from '~~/utils/ValidateEmail'

import DataPublisher from '~~/services/datapublisher'


export default {
    Query: {
        async Users(root, {
            limit = 0,
            skip = 0
        }, { UserProvider, pubSub }){
            let queryParams = {}

            return await UserProvider.Find({ filter: queryParams, limit: limit, skip: skip })
        },

        async Me(root, params, { UserProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await UserProvider.FindOne({filter: {
                _id: user._id,
                email: user.email
            }})
        },

        async UserById(root, { id }, { UserProvider, user }){
            if(!user) return null
            if(!user._id || !user.email) return null

            return await UserProvider.FindById(id)
        },
    },

    Subscription: {
        UserLoggedIn: {
            subscribe(root, args, context){
                const data = DataPublisher.asyncIterator('user.login')
                return data
            }
        }
    },

    Mutation: {
        async Login(parent, { email, password }, { UserProvider, pubSub }){
            let userQuery = { status: 'active' }

            let isEmail = ValidateEmail(email)

            if(isEmail){
                userQuery['email'] = { $regex: new RegExp('^' + email + '$', 'i') }
            }else{
                userQuery['username'] = email
            }

            const user = await UserProvider.FindOne({ filter: userQuery })
            if(!user) throw new AuthenticationError('not_found')

            const passwordCheck = await bcrypt.compare(password, user.password)
            if(!passwordCheck) throw new AuthenticationError('not_found')

            let token = CreateJWTToken({ user })

            DataPublisher.publish('user.login', { UserLoggedIn: user })

            return { token }
        },


        async CreateUser(parent, { data }, { UserProvider, user }){
            if(!!!await Authorize(user)) return false
            
            data.password = await HashPassword(data.password)
            
            return await UserProvider.Create(data)
        },

        async UpdateUser(parent, { id, data }, { UserProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentUser = await UserProvider.FindById(id)
            if(!currentUser) throw new UserInputError('not_found')

            if(data.password && data.password != '') data.password = await HashPassword(data.password)
            
            return await UserProvider.UpdateById(id, data)
        },
        async DeleteUser(parent, { id }, { UserProvider, user }){
            if(!!!await Authorize(user)) return false

            const currentUser = await UserProvider.FindById(id)
            if(!currentUser) throw new UserInputError('not_found')

            await UserProvider.DeleteById(id)

            return currentUser
        }
    },

    User: {
        
    },
}