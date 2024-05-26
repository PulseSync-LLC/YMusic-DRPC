import {
    ApolloClient,
    InMemoryCache,
    ApolloLink,
    HttpLink,
    concat,
} from '@apollo/client'
import config from "../../config.json"
const graphqlUrl = config.SERVER_URL + '/graphql'

const httpLink = new HttpLink({ uri: graphqlUrl })

const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            Authorization:
                `Bearer: ${window.electron.store.get("token")}` || null,
        },
    })

    return forward(operation)
})

const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    ssrMode: true,
    uri: graphqlUrl,
    cache: new InMemoryCache({
        resultCaching: true,
    }),
})

export default client
