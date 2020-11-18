<template>
  <b-jumbotron>
    <h1>Register</h1>

    <UserAuthForm buttonText="Register" :submitForm="registerUser" hasName="true" />
    <b-modal id="bv-modal-register" hide-footer>
      <template v-slot:modal-title>
        Registration Confirmed
      </template>
      <div class="d-block text-center">
        Thank you for submitting your registration. An admin will approve your request shortly.
      </div>
      <b-button class="mt-3" block @click="closeAndRedirect">OK</b-button>
    </b-modal>
  </b-jumbotron>
</template>

<script>
  import UserAuthForm from '@/components/UserAuthForm'
  import { SIGNUP_MUTATION } from '@/apollo/graphql'
  
  export default {
    components: {
      UserAuthForm
    },
    methods: {
      registerUser (registrationinfo) {
        this.$apollo
            .mutate({
            mutation: SIGNUP_MUTATION,
            variables: {
                data: registrationinfo
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