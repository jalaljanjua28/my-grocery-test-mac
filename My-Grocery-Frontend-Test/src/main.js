import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import router from "./router";
import store from "./store/index.js";
import "../styles.css";
import { firebaseApp } from "./Firebase.js"; // Adjust path if necessary

Vue.config.productionTip = false;
Vue.config.silent = true;
Vue.prototype.$firebaseApp = firebaseApp; // Inject firebaseApp into Vue's prototype

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
