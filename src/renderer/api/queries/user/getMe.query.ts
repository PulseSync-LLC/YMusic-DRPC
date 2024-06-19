import gql from 'graphql-tag'

export default gql`
    query users {
        getMe {
            avatar
            username
            perms
            id

            badges {
                uuid
                type
                level
            }
        }
    }
`
