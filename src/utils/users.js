const users = []

const addUser = ({ id, username, room}) => {
    
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'User is in use'
        }
    }

    const user = {
        id,
        username,
        room
    }
    users.push(user)
    return {
        user
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)
    }

}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

const user1 = {
    id: 123,
    username: 'bibo',
    room: 'private'
}

const user2 = {
    id: 124,
    username: 'ethan',
    room: 'private'
}

const user3 = {
    id: 125,
    username: 'john',
    room: 'public'
}

// addUser(user1)
// addUser(user2)
// addUser(user3)
// console.log(users)
// // console.log('remove', removeUser(124))
// console.log('user124: ', getUser(456))
// console.log('user in room: ', getUsersInRoom('private'))

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
