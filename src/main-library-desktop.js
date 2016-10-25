// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'

// import fonts here because this is the electron app
import './assets/fonts/Noto_Sans_TC/NotoSansTC.scss'
import './assets/fonts/Noto_Sans/NotoSans.scss'
import './assets/fonts/avenir-next-lt-pro/avenir-next-lt-pro.scss'

import 'normalize.css'

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})






/**
 * graphql client with vuex sync
 */
import gql from 'graphql-tag'
import apolloClient from './apolloClient'
import { updateSeats } from './store/actions'

// function arr2obj(arr, key) {
// 	return arr.reduce((o, v) => {
// 		o[v[key]] = v
// 		return o
// 	}, {})
// }

apolloClient.watchQuery({
	query: gql`
		{
			all_seats {
				seat_id
				status
			}
		}
	`,
	pollInterval: 300, // ms
}).subscribe({
	next ({ data }) {
		// const obj = arr2obj(data.all_seats, 'seat_id')
		updateSeats(store, data.all_seats)
	},
	error (err) {
		console.error(err)
	}
})

