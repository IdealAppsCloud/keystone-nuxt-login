<template>
  <b-jumbotron>
    <h1>Login</h1>

    <UserAuthForm buttonText="Login" :submitForm="loginUser" :postLoginAction="redirect" />
  </b-jumbotron>
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'
import { LOGIN_MUTATION, AUTHENTICATED_USER_QUERY } from '@/apollo/graphql'

export default {
  components: {
      UserAuthForm
  },
  name: 'Login',
  methods: {
    loginUser (userInfo) {
      this.$apollo
        .mutate({
          mutation: LOGIN_MUTATION,
          variables: {
            email: userInfo.email,
            password: userInfo.password
          },
          update: (store, { data: { authenticateUserWithPassword } }) => {

            // read data from cache for this query
            const data = store.readQuery({ query: AUTHENTICATED_USER_QUERY })

            const authenticatedUser = {}
            authenticatedUser.__typename = authenticateUserWithPassword.__typename
            authenticatedUser.id = authenticateUserWithPassword.item.id
            authenticatedUser.firstName = authenticateUserWithPassword.item.firstName
            authenticatedUser.lastName = authenticateUserWithPassword.item.lastName
            authenticatedUser.email = authenticateUserWithPassword.item.email
            authenticatedUser.isAdmin = authenticateUserWithPassword.item.isAdmin
            authenticatedUser.isMember = !authenticateUserWithPassword.item.isAdmin

            data.authenticatedUser = authenticatedUser

            // write data back to the cache
            store.writeQuery({ query: AUTHENTICATED_USER_QUERY, data })
          }
        }
        )
        .then(response => {
          // save user token to localstorage
          localStorage.setItem('keystone-token', response.data.authenticateUserWithPassword.token)
          this.$toast.success('Successfully authenticated', {duration: 5000, keepOnHover: true, closeOnSwipe: true})

          // redirect user
          this.$router.replace('/nuxt')
        })
        .catch((error) => {
          // Error
          this.$toast.clear()
          this.$toast.error('Error while authenticating - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
        })
    },
    redirect(){
        const REDIRECT_URI = this.$route.query.redirect || '/'
        this.$router.push(REDIRECT_URI)
      }
  }
}
</script>
