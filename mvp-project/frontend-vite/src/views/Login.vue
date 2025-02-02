<template>
  <div>
    <v-app-bar flat class="px-4 blur-bg">
      <v-toolbar-title class="text-h5">Sign In</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="mt-4 pa-4">
              <v-form @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="username"
                  label="Username"
                  variant="outlined"
                  class="mb-4"
                  required
                  :rules="[v => !!v || 'Username is required']"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  class="mb-6"
                  required
                  :rules="[v => !!v || 'Password is required']"
                ></v-text-field>

                <v-btn
                  type="submit"
                  color="primary"
                  block
                  height="48"
                  :loading="loading"
                >
                  Sign In
                </v-btn>

                <v-btn
                  variant="text"
                  block
                  class="mt-2"
                  @click="router.push('/register')"
                >
                  Create Account
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import type { State } from '@/types'
import { loginUser } from '@/api'

interface LoginResponse {
  access_token: string;
}

export default defineComponent({
  name: 'Login',
  
  setup() {
    const router = useRouter()
    const store = useStore<State>()
    const username = ref('')
    const password = ref('')
    const loading = ref(false)

    const handleSubmit = async (): Promise<void> => {
      loading.value = true
      try {
        const response = await loginUser({ 
          username: username.value, 
          password: password.value 
        })
        const data = response.data as LoginResponse
        store.commit('setToken', data.access_token)
        router.push('/')
      } catch (error) {
        alert('Failed to login')
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      password,
      loading,
      handleSubmit,
      router
    }
  }
})
</script>

<style scoped>
// ...existing code...
</style>
