import { AuthenticationError } from 'apollo-server-express'
import UserProvider from '~~/graphs/user/provider'
import { ObjectId } from 'mongodb'

export default async (user) => {
    if(!!!user) throw new AuthenticationError('not_authorized')
    if(!!!user.email || !!!user._id) throw new AuthenticationError('not_authorized')

    const loggedInUser = await UserProvider.Find({ filter: { _id: ObjectId(user._id), email: user.email } })

    return !!loggedInUser
}