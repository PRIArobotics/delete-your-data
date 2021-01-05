import axios from 'axios';

export const state = () => ({
  initialized: false,
  list: [],
  // map: new Map(),
});

export const mutations = {
  setList(state, list) {
    state.initialized = true;
    state.list = list;
    // state.map.clear();
    // for (const item of list) {
    //   state.map.set([item.pluginUuid, item.tokenUuid], item);
    // }
  },

  createItem(state, item) {
    state.list.push(item);
    // state.map.set([item.pluginUuid, item.tokenUuid], item);
  },

  // updateItem(state, { pluginUuid, tokenUuid, ...item }) {
  //   const found = state.list.find((x) => x.pluginUuid === pluginUuid && x.tokenUuid === tokenUuid);
  //   Object.assign(found, item);
  // },

  deleteItem(state, { pluginUuid, tokenUuid }) {
    const index = state.list.findIndex(
      (x) => x.pluginUuid === pluginUuid && x.tokenUuid === tokenUuid,
    );
    state.list.splice(index, 1);
    // state.map.delete([pluginUuid, tokenUuid]);
  },
};

export const actions = {
  async initialize({ state, dispatch }) {
    if (state.initialized) return;
    await dispatch('refresh');
  },

  async refresh({ commit }) {
    const items = await this.$axios.$get('/api/access/');
    commit('setList', items);
  },

  async create({ commit }, item) {
    const newItem = await this.$axios.$post('/api/access/', item);
    commit('createItem', newItem);
  },

  async delete({ commit }, item) {
    await this.$axios.$delete(`/api/token/${item.tokenUuid}/access/${item.pluginUuid}`);
    commit('deleteItem', item);
  },
};
