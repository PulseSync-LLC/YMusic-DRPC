import gql from 'graphql-tag'

export default gql`
    query users {
        getMe {
            avatar
            banner
            username
            perms
            id
    
            badges {
                uuid
                name
                type
                level
            }
        }
    }
`
