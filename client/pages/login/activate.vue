<template>
  <b-jumbotron>
    <br/>
        <h2>User Activation</h2>
    <br/>
    <div>
        <b-form-textarea id="textarea" plaintext :value="text"></b-form-textarea>
        <UserAuthForm buttonText="Activate" :submitForm="activateUser" />
    </div>
    <b-modal id="bv-modal-invalidate-token" hide-footer>
      <template v-slot:modal-title>
        Invalid Activation Token
      </template>
      <div class="d-block text-center">
        Your activation token is invalid. An email has been sent with a new activation link.
      </div>
      <b-button class="mt-3" block @click="closeAndRedirect">OK</b-button>
    </b-modal>
    <b-modal id="bv-modal-valid-token" hide-footer>
      <template v-slot:modal-title>
        Congratulations
      </template>
      <div class="d-block text-center">
        Your account is now activated. Press OK to continue.
      </div>
      <b-button class="mt-3" block @click="closeAndRedirectValid">OK</b-button>
    </b-modal>
  </b-jumbotron>
</template>

<script>
import { LOGIN_MUTATION, AUTHENTICATED_USER_QUERY, UPDATE_USER_MUTATION } from '@/apollo/graphql'
import { logOut } from '@/services/user'
import { randomStringAsBase64Url } from '@/services/token'


export default {
  name: 'Activate',
  data () {
    return {
      text: "Please enter your login credentials to activate your account."
    }
  },
  methods: {
    /*********************************************************************************************************************
     * Activate User logs the user on initially then checks if the token in the route query matches the token that was 
     * generated on registration. if they match then updates the isVerfied flag to true. If they do not match then a new
     * token is generated and saved to keystone which then sends out a new activation link.
     *********************************************************************************************************************/
    activateUser: function (userInfo) {

      const verificationToken = this.$route.query.token

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
            authenticatedUser.isMember = authenticateUserWithPassword.item.isMember

            data.authenticatedUser = authenticatedUser

            // write data back to the cache
            store.writeQuery({ query: AUTHENTICATED_USER_QUERY, data })
          }
        }
        )
        .then(response => {

          // save user token to localstorage
          localStorage.setItem('keystone-token', response.data.authenticateUserWithPassword.token)

          if (response.data.authenticateUserWithPassword.item.verificationToken === verificationToken)
          {
            this.$apollo
              .mutate({
                mutation: UPDATE_USER_MUTATION,
                variables: {
                  id: response.data.authenticateUserWithPassword.item.id,
                  data: {
                    isVerified: true
                  }
                }
              }).then(response => {
                this.$bvModal.show('bv-modal-valid-token')
              }).catch((error) => {
                // Error
                this.$toast.clear()
                this.$toast.error('Error while verifying email. - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
                logOut(this.$apollo, this.$toast)
              })
          }
          else{
            this.$apollo
              .mutate({
                mutation: UPDATE_USER_MUTATION,
                variables: {
                  id: response.data.authenticateUserWithPassword.item.id,
                  data: {
                    verificationToken: randomStringAsBase64Url(16)
                  }
                }
              }).then(response => {
                logOut(this.$apollo, this.$toast)
                this.$bvModal.show('bv-modal-invalidate-token')
              }).catch((error) => {
                // Error
                this.$toast.clear()
                this.$toast.error('Error while verifying email. - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
                logOut(this.$apollo, this.$toast)
              })
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
        this.$router.replace('/login')
    },
    closeAndRedirectValid () {
        this.$bvModal.hide('bv-modal-valid-token')
        this.$router.replace('/nuxt')
    }
  }
}
</script>