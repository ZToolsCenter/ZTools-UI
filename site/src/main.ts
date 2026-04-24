import { createApp } from 'vue'
import { installMock } from './mocks/ztools'
import 'ztools-ui-assets/styles'
import App from './App.vue'
import { createRouter } from './router'

// Inject mock before anything else
installMock()

const app = createApp(App)
app.use(createRouter())
app.mount('#app')
