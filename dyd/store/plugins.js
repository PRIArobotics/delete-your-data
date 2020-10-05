import axios from 'axios';

export const state = () => ({
  list: [],
  map: new Map(),
});

export const mutations = {
  setList(state, list) {
    state.list = list;
    state.map.clear();
    for (const item of list) {
      state.map.set(item.uuid, item);
    }
  },

  createItem(state, item) {
    state.list.push(item);
    state.map.set(item.uuid, item);
  },

  updateItem(state, { uuid, ...item }) {
    const found = state.list.find((x) => x.uuid === uuid);
    Object.assign(found, item);
  },

  deleteItem(state, { uuid }) {
    const index = state.list.findIndex((x) => x.uuid === uuid);
    state.list.splice(index, 1);
    state.map.delete(uuid);
  },
};

export const actions = {
  async refresh({ commit }) {
    const items = await this.$axios.$get('/api/plugin/');
    commit('setList', items);
  },

  async create({ commit }, item) {
    const { name, type, config } = item;

    const newItem = await this.$axios.$post('/api/plugin/', { name, type, config });
    commit('createItem', newItem);
  },

  async update({ commit }, item) {
    const { uuid, name, type, config } = item;

    await this.$axios.$put(`/api/plugin/${uuid}`, { name, type, config });
    commit('updateItem', item);
  },

  async delete({ commit }, item) {
    await this.$axios.$delete(`/api/plugin/${item.uuid}`);
    commit('deleteItem', item);
  },
};
