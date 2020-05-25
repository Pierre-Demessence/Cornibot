import Vue from "vue";
import Vuex from "vuex";
import { createDirectStore } from "direct-vuex";

Vue.use(Vuex);

export interface RootState {
  someField: never;
}

const { store, rootActionContext, moduleActionContext, rootGetterContext, moduleGetterContext } = createDirectStore({
  strict: process.env.NODE_ENV !== "production",
  modules: {},
  state: {} as RootState,
  mutations: {},
  actions: {}
});

// Export the direct-store instead of the classic Vuex store.
export default store;

// The following exports will be used to enable types in the
// implementation of actions.
export { rootActionContext, moduleActionContext, rootGetterContext, moduleGetterContext };

// The following lines enable types in the injected store '$store'.
export type AppStore = typeof store;
declare module "vuex" {
  interface Store<S> {
    direct: AppStore;
  }
}
