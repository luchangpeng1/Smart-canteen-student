import { createStore } from 'vuex'
import user from './modules/user'

const store = createStore({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user
  },
  plugins: [
    store => {
      store.subscribeAction({
        error: (action, state, error) => {
          console.error(`Error in action ${action.type}:`, error)
        }
      })
    }
  ]
})

store.subscribe((mutation, state) => {
  localStorage.setItem('vuex-state', JSON.stringify(state))
})

const savedState = localStorage.getItem('vuex-state')
if (savedState) {
  store.replaceState(JSON.parse(savedState))
}

export default store 
