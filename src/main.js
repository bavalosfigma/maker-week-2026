import { createApp } from 'vue'
import App from './App.vue'
import NoiseOverlay from './components/NoiseOverlay.vue'
import './style.css'

createApp(App).mount('#app')
createApp(NoiseOverlay).mount(
  document.body.appendChild(document.createElement('div')),
)
