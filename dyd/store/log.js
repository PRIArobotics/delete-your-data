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
    //   state.map.set(item.uuid, item);
    // }
  },

  createItem(state, item) {
    state.list.push(item);
    // state.map.set(item.uuid, item);
  },

  updateItem(state, { uuid, ...item }) {
    const found = state.list.find((x) => x.uuid === uuid);
    Object.assign(found, item);
  },

  deleteItem(state, { uuid }) {
    const index = state.list.findIndex((x) => x.uuid === uuid);
    state.list.splice(index, 1);
    // state.map.delete(uuid);
  },
};

export const actions = {
  async initialize({ state, dispatch }) {
    if (state.initialized) return;
    await dispatch('refresh');
  },

  async refresh({ commit }) {
    const items = await this.$axios.$get('/api/log/');
    commit('setList', items);
  },

  async create({ commit }, item) {
    const newItem = await this.$axios.$post('/api/log/', item);
    commit('createItem', newItem);
  },

  async update({ commit }, item) {
    const { uuid, ...values } = item;

    await this.$axios.$put(`/api/log/${uuid}`, values);
    commit('updateItem', item);
  },

  async delete({ commit }, item) {
    await this.$axios.$delete(`/api/log/${item.uuid}`);
    commit('deleteItem', item);
  },
};
