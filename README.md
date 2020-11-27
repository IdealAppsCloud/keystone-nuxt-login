# keystone-nuxt-login
Example of a keystone nuxt integration with user registration and activation by email link.

## Pre-requisites
Requires a mailgun account - https://login.mailgun.com/login/

Take note of the API Key, Domain and From Email values - these will need to be set in the environment variables.

## Install locally

```
npm install
```

## Set the environment variables
Create a .env file in the root of the project and add the following variables
```
NODE_ENV="<ENVIRONMENT>"
MAILGUN_API_KEY="<API_KEY>"
MAILGUN_DOMAIN="<DOMAIN>"
MAILGUN_FROM_NAME="keystone nuxtjs login"
MAILGUN_FROM_EMAIL="<FROM_EMAIL>"
```

## Run
```
npm run dev
```

## Register

http://localhost:3000/login/register

### Notes

You may need to check your spam folder for emails from mailgun particularly if using a trial mailgun account.