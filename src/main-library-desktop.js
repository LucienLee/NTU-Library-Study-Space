// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'

// import fonts here because this is the electron app
import './assets/fonts/Noto_Sans_TC/NotoSansTC.scss'
import './assets/fonts/Avenir_Next_LT_Pro/AvenirNextLTPro.scss'


// Normalize style
import 'normalize.css'

// Inject global modal method in Vue
import MessageModal from './plugins/MessageModal.js'
Vue.use(MessageModal)

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
