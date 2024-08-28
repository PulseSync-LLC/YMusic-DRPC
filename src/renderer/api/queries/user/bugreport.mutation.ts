import { gql } from '@apollo/client'

export const CREATE_BUG_REPORT = gql`
    mutation CreateBugReport(
        $title: String!
        $description: String!
        $steps: String!
    ) {
        createBugReport(
            input: { title: $title, description: $description, steps: $steps }
        ) {
            uuid
            title
            description
            steps
            status
            createdAt
            updatedAt
        }
    }
`
