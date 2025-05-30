import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import router from "@/router";
import "@/style.css";
import App from "@/App.vue";

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);

app.config.globalProperties.$axios = axios;

app.mount("#app");
