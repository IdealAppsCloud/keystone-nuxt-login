function logOut (apollo,toast) {
    const graphql = require("@/apollo/graphql")

    apollo
      .mutate({
        mutation: graphql.LOGOUT_MUTATION,
        update: (store, { data: { unauthenticateUser } }) => {
          // read data from cache for this query
          const data = store.readQuery({ query: graphql.AUTHENTICATED_USER_QUERY })

          if (data.authenticatedUser){
            data.authenticatedUser.id = ''
            data.authenticatedUser.firstName = ''
            data.authenticatedUser.lastName = ''
            data.authenticatedUser.email = ''
            data.authenticatedUser.isAdmin = false

            // write data back to the cache
            store.writeQuery({ query: graphql.AUTHENTICATED_USER_QUERY, data })
          }
          
        }
      })
      .then(response => {
        // save user token to localstorage
        localStorage.removeItem('keystone-token')
      })
      .catch((error) => {
        // Error
        toast.error('Error - '+error, {duration: 5000, keepOnHover: true, closeOnSwipe: true})
      })
  }

export { logOut }
