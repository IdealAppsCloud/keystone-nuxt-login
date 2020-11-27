<template>
  <b-jumbotron>
    <h1>Login</h1>

    <UserAuthForm buttonText="Login" :submitForm="loginUser" />

    <b-modal id="bv-modal-invalidate-token" hide-footer>
      <template v-slot:modal-title>
        Invalid Activation Token
      </template>
      <div class="d-block text-center">
        Your account has not yet been activated. Please check your email for your activation link or enter your credentials again on the Activation page to generate a new link.
      </div>
      <b-button class="mt-3" block @click="closeAndRedirect">OK</b-button>
    </b-modal>

  </b-jumbotron>
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'
import { LOGIN_MUTATION, AUTHENTICATED_USER_QUERY } from '@/apollo/graphql'
import { logOut } from '@/services/user'

export default {
  components: {
      UserAuthForm
  },
  name: 'Login',
  methods: {
    /*********************************************************************************************************************
     * This logs the user in. If the user has not been activated i.e. the isVerfied flag is true then the user is logged 
     * out again immediately and redirected to the activate page.
     ********************************************************************************************************************/
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

          if (response.data.authenticateUserWithPassword.item.isVerified === true)
          {
            // redirect user
            this.$router.replace('/nuxt')
          }else{
            logOut(this.$apollo, this.$router, this.$toast)
            this.$bvModal.show('bv-modal-invalidate-token')
          }
        })
        .catch((error) => {
          // Error
          this.$toast.clear()
          this.$toast.error('Error while authenticating - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
        })
    },
    closeAndRedirect () {
        this.$bvModal.hide('bv-modal-invalidate-token')
        this.$router.replace('/login/activate')
    },
  }
}
</script>
