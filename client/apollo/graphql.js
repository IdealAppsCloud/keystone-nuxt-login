import gql from 'graphql-tag'

export const SIGNUP_MUTATION = gql`mutation ($data: UserCreateInput!) {
    createUser(data: $data ) {
        id
        email
    }
}`

export const ALL_USER_REGISTRATIONS_QUERY = gql`query AllUserRegistrationsQuery {
    allUserRegistrations {
        id
        firstName
        lastName
        email
        status
    }
}`

export const UPDATE_USER_MUTATION = gql`mutation ($id: ID!, $data: UserUpdateInput!) {
    updateUser(id: $id, data: $data ) {
        id
        email
    }
}`

export const LOGIN_MUTATION = gql`mutation authenticate($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password ) {
        item{ id, firstName, lastName, email, isAdmin, isMember, verificationToken, isVerified },
        token
    }
}`

export const LOGOUT_MUTATION = gql`mutation unauthenticate {
    unauthenticateUser {
        success
    }
}`

export const AUTHENTICATED_USER_QUERY = gql`query AuthenticatedUserQuery {
    authenticatedUser {
        id
        firstName
        lastName
        email
        isAdmin
        isMember
    }
}`

export const ALL_USERS_QUERY = gql`query AllUsersQuery {
    allUsers {
        id
        firstName
        lastName
        email
        isMember
    }
}`

export const ALL_USERS_TOKEN_QUERY = gql`query AllUsersQuery($token: String!) {
    allUsers(where: {verificationToken: $token}) {
        id
    }
}`
