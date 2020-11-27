<template>
  <b-jumbotron>
    <h1>Register</h1>

    <UserAuthForm buttonText="Register" :submitForm="registerUser" hasName="true" />
    <b-modal id="bv-modal-register" hide-footer>
      <template v-slot:modal-title>
        Registration Confirmed
      </template>
      <div class="d-block text-center">
        Thank you for submitting your registration. Please check your email for your account activation link.
      </div>
      <b-button class="mt-3" block @click="closeAndRedirect">OK</b-button>
    </b-modal>
  </b-jumbotron>
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'
import { SIGNUP_MUTATION } from '@/apollo/graphql'
import { randomStringAsBase64Url } from '@/services/token'

export default {
  components: {
    UserAuthForm
  },
  methods: {
    /*********************************************************************************************************************
     * This method registers the user, i.e. creates an item in the User list which will then generate an activation email
     * with a link to activate the account. This link contains a verification token as generated below.
     ********************************************************************************************************************/
    registerUser (registrationinfo) {

      var regInfo = {
        firstName: registrationinfo.firstName,
        lastName: registrationinfo.lastName,
        email: registrationinfo.email,
        password: registrationinfo.password,
        verificationToken: randomStringAsBase64Url(16),
      }

      this.$apollo.mutate({
        mutation: SIGNUP_MUTATION,
        variables: {
            data: regInfo
        }
      })
      .then(response => {
          this.$bvModal.show('bv-modal-register')
      })
      .catch((error) => {
        this.$toast.error('Error while registering - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
      })
    },
    closeAndRedirect () {
        this.$bvModal.hide('bv-modal-register')
        this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>