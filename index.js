const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password, CalendarDay, DateTime, Relationship, Integer } = require('@keystonejs/fields');
const { MongoId } = require('@keystonejs/fields-mongoid');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');

/*****************************
 * Mongo
 *****************************/
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const mongoUriToConnectTo = process.env.NODE_ENV === 'production' ? (process.env.MONGO_URI) : ('mongodb://127.0.0.1:27017/keystone-nuxt-login');
const adapterConfig = { mongoUri: mongoUriToConnectTo };
const initialiseData = require('./initial-data');

const PROJECT_NAME = "Keystone Nuxt Login";

/*****************************
 * Nuxt
 *****************************/
const { NuxtApp } = require('@keystonejs/app-nuxt');
const nuxtConfig = require('./client/nuxt.config')

/*****************************
 * Keystone
 *****************************/
const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  onConnect: initialiseData,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: false,
  },
  // Required for production mode
  cookieSecret: 'This is a very secret very-secret!!!!!'
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userIsMember = ({ authentication: { item: user } }) => Boolean(user && user.isMember);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return { id: user.id };
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userIsMember, userOwnsItem, userIsAdminOrOwner };

keystone.createList('User', {
  fields: {
    firstName: { type: Text },
    lastName: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    isMember: {
      type: Checkbox
    },
    password: {
      type: Password,
    },
  },
  // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    // create: access.userIsAdminOrOwner,
    delete: access.userIsAdmin,
    auth: true,
  },
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

const apps = [
    new GraphQLApp(),
    new AdminUIApp({
        enableDefaultRoute: true,
        authStrategy,
    }),
    new NuxtApp(nuxtConfig)
];

module.exports = {
  keystone,
  apps,
  configureExpress: app => {
    // Required for production mode to use secure cookies
    app.set('trust proxy', 1);
  },
};
