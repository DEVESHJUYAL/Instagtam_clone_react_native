import { USERS } from "./users";
export const POSTS = [
    {
        ImageUrl: require('../assets/scene.jpg'),
        user: USERS[0].user,
        likes: 7870,
        caption: 'Richest person in the World',
        profile_picture: USERS[0].image,
        comments: [
            {
                user: 'elon',
                comment: 'great good luck'
            },
            {
                user: 'elon',
                comment: 'great good luck'
            },
        ],
    },
    {
        ImageUrl: require('../assets/elon.jpg'),
        user: USERS[1].user,
        likes: 7870,
        caption: 'Richest person in the World',
        profile_picture: USERS[1].image,
        comments: [
            {
                user: 'elon',
                comment: 'great good luck'
            },
            {
                user: 'elon',
                comment: 'great good luck'
            },
        ],
    },


]