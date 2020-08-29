import Provider from '~~/services/data/provider'

// class DataProvider extends Provider {
//     constructor(collectionName){
//         super(collectionName)
//     }
// }

const userProvider = new Provider('users')
const attachmentProvider = new Provider('attachments')
const collectionProvider = new Provider('collections')

const Start = async () => {
    let users = await userProvider.Find()
    // let attachments = await attachmentProvider.Find()
    let collections = await collectionProvider.Find()

    const usersWithProperties = users.filter((user) => {
        return typeof user.properties !== 'undefined' && user.properties.length > 0
    })

    console.log(usersWithProperties)
    


    // const usersWithAvatar = users.filter((user) => {
    //     return !!user.avatarUserGenerated
    // })

    // // console.log(usersWithAvatar)

    // const usersWithAvatarCreatedBySameUser = []

    // usersWithAvatar.map((user) => {
    //     let attachment = attachments.find((attachment) => { return attachment._id.toString() == user.avatarUserGenerated.toString() })
    //     console.log(attachment)
    //     if(attachment.createdBy.toString() == user._id.toString()){
    //         usersWithAvatarCreatedBySameUser.push({ user, attachment })
    //     }
    // })

    // usersWithAvatarCreatedBySameUser.map((item) => {
    //     console.log(item.user._id, item.attachment._id)
    // })
}

Start()