import UserProvider from '~~/graphs/user/provider'
import HashPassword from '~~/utils/HashPassword'

const Start = async () => {
    const user = await UserProvider.Create({
        username: 'daspete',
        email: 'daspetemail@gmail.com',
        firstname: 'Das',
        lastname: 'PeTe',
        gender: 'male',
        status: 'active',
        password: await HashPassword('123456')
    })

    console.log('user created', user)
}

Start()