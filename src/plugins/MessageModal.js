import Vue from 'vue'
import Modal from '../components/Modal'

let ModalConstructor = Vue.extend(Modal)
let instance

let messageModal = function(options){
	// Initialize Modal
	if (!instance) {
		instance = new ModalConstructor({
			el: document.createElement('div'),
		})
		document.body.appendChild(instance.$el)

		instance.$on('input', (val)=>{
			instance.value = val
		})
	}

	// Set modal props
	for( let prop in options ){
		instance[prop] = options[prop]
	}

	Vue.nextTick(() => {
		instance.value = true
	})
}

function install (Vue) {
	if (this.installed) return
	this.installed = true

	Vue.prototype.$modal = messageModal
}

export default { install }

