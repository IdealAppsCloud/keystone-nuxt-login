<template>
  <b-jumbotron>
    <div v-if="$apollo.queries.allUsers.loading" class="d-flex justify-content-center mb-3">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
    </div>
    <br/>
    <h2>User Registrations</h2>
    <br/>

    <div v-show="authenticatedUser.isAdmin" v-for="user in allUsers" :key="user.id">
        <b-card bg-variant="light" text-variant="black" v-bind:title=user.email>
          <b-card-text>
              {{ user.firstName}} {{ user.lastName }}
          </b-card-text>
          <b-card-text>
              Email: {{ user.email }}
          </b-card-text>
          <b-card-text v-if="user.isMember">
              Status: Approved
          </b-card-text>
          <b-button v-else @click="approveUser(user)" variant="primary">Approve User</b-button>
        </b-card>
      <p></p>
    </div>
  </b-jumbotron>
</template>

<script>
import { ALL_USERS_QUERY, AUTHENTICATED_USER_QUERY, UPDATE_USER_MUTATION } from '@/apollo/graphql'


export default {
  name: 'UserRegistrationsList',
  data () {
    return {
      allUsers: [],
      authenticatedUser: {isAdmin: false}
    }
  },
  apollo: {
    allUsers: {
      query: ALL_USERS_QUERY,
      error (error) {
        this.$toast.error('Error - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
      }
    },
    authenticatedUser: {
      query: AUTHENTICATED_USER_QUERY,
      error (error) {
        this.$toast.error('Error - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
      },
      result (_result, key) {
        if (_result.data.authenticatedUser == null) {
          // save user token to localstorage
          localStorage.removeItem('keystone-token')

          // redirect user
          this.$router.replace('/login')
        }
      }
    }
  },
  methods: {
    approveUser (user) {
      const userId = user.id

      this.$apollo
        .mutate({
          mutation: UPDATE_USER_MUTATION,
          variables: {
            id: user.id,
            data: {
              isMember: true
            }
          },
          update: (store, { data: { updateUser } }) => {
            // read data from cache for this query
            const data = store.readQuery({ query: ALL_USERS_QUERY })

            const userToUpdate = data.allUsers.find(g => g.id === userId)

            userToUpdate.isMember = true

            // write data back to the cache
            store.writeQuery({ query: ALL_USERS_QUERY, data })
          }
        })
        .then(response => {
          this.$toast.success('User has been approved as a member.', {duration: 5000, keepOnHover: true, closeOnSwipe: true})
        })
        .catch((error) => {
          // Error
          this.$toast.error('Error - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
        })
    }
  }
}
</script>
