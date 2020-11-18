<template>
  <b-form v-model="valid">
    <b-form-group id="input-group-firstName" label="Your Name:" label-for="input-firstName" v-if="hasName">
      <b-form-input
        id="input-firstName"
        v-model="userInfo.firstName"
        required
        placeholder="Enter first name"
      ></b-form-input>
    </b-form-group>
    <b-form-group id="input-group-lastName" label="Your Name:" label-for="input-lastName" v-if="hasName">
      <b-form-input
        id="input-lastName"
        v-model="userInfo.lastName"
        required
        placeholder="Enter last name"
      ></b-form-input>
    </b-form-group>
    <b-form-group
        id="input-group-email"
        label="Email address:"
        label-for="input-email"
      >
        <b-form-input
          id="input-email"
          v-model="userInfo.email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-password"
        label="Password:"
        label-for="input-password"
      >
        <b-form-input
          id="input-password"
          v-model="userInfo.password"
          type="password"
          required
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>
    <b-button @click="submitForm(userInfo)" :disabled="!valid">{{ buttonText }}</b-button>
  </b-form>
</template>

<script>
  export default {
    data() {
      return {
        valid: false,
        showPassword: false,
        userInfo: {
          email: '',
          password: ''
        }
      }
    },
    props: ["submitForm", "buttonText", "hasName"]
  }
</script>

<style lang="scss" scoped>
</style> 