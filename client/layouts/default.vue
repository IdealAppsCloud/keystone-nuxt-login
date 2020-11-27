<template>
  <div>
     <div>
      <b-navbar toggleable="lg" fixed="top" :sticky=true type="dark" variant="dark">
        <NuxtLink to="/nuxt/">
          <b-navbar-brand><b-icon icon="house-door" variant="light"/> Keystone Nuxt Login </b-navbar-brand>
        </NuxtLink>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item v-show="isLoggedIn==false" to="/login/register">Register</b-nav-item>
            <b-nav-item v-show="isLoggedIn==false" to="/login">Login</b-nav-item>
            <b-nav-item v-show="isAdmin" to="/login/registration/list">All User Registrations</b-nav-item>
            <b-nav-item :href="allOrganizations[0].webSite">{{allOrganizations[0].name}}</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto" v-if="authenticatedUser && authenticatedUser.id!=''">
            <b-nav-item-dropdown right>
              <template v-slot:button-content>
                  <em>{{authenticatedUser.firstName}} {{authenticatedUser.lastName}}</em>
              </template>
            <!--  <b-dropdown-item href="#">Profile</b-dropdown-item>  -->
              <b-dropdown-item @click="logOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      </div>
        <Nuxt />
      <div>

      <div class="text-center">
        <p>
          <a href="https://www.linkedin.com/in/peter-murphy-61493974/" target="_top">Created by Peter Murphy</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { AUTHENTICATED_USER_QUERY, LOGOUT_MUTATION } from '@/apollo/graphql'
import { logOut } from '@/services/user'

export default {
  name: 'app',
  data () {
    return {
      authenticatedUser: {
        firstName: '',
        lastName: '',
        id: '',
        isAdmin: false
      },
      allOrganizations: [
        {
          name: '',
          webSite: ''
        }
      ]
    }
  },
  apollo: {
    authenticatedUser: {
      query: AUTHENTICATED_USER_QUERY
    }
  },
  computed: {
    isAdmin () {
      if (this.authenticatedUser) { return this.authenticatedUser.isAdmin } else { return false }
    },
    isLoggedIn () {
      if (this.authenticatedUser) { return true } else { return false }
    },
  },
  methods: {
    logOut () {
      logOut(this.$apollo, this.$toast)
      this.$router.replace('/login')
    }
  },
  watch: {
    $route (to, from) {
      // clear toast on location change
      this.$toast.clear()
    }
  }
}
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
