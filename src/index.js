import components from "./components";
import validator from "./validator";

export function install(Vue) {
  if (install.installed) return;
  for (const keyName in components) {
    const component = components[keyName];
    Vue.component(component.name, component);
  }
  install.installed = true;
}

const YoValidator = {
  install,
  setRule: validator.setRule.bind(validator),
  setMessages: validator.setMessages.bind(validator),
  setLanguage: validator.setLanguage.bind(validator)
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}

if (GlobalVue) {
  GlobalVue.use(YoValidator);
}

export default YoValidator
