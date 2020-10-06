<template>
  <v-data-table :headers="headers" :items="items" item-key="uuid" show-expand class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Account</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Account</v-btn>
          </template>
          <v-card>
            <v-form @submit.prevent="save">
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.nativeId" label="Native ID"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.pluginUuid"
                        :items="plugins"
                        item-text="name"
                        item-value="uuid"
                        label="Plugin UUID"
                        single-line
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text type="submit">Save</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>

    <template v-slot:item.pluginName="{ item }">
      {{ getPluginName(item) }}
    </template>

    <template v-slot:item.nativeId="{ item }">
      {{ JSON.stringify(item.nativeId) }}
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <dl>
          <dt>UUID</dt>
          <dd>{{ item.uuid }}</dd>
          <dt>Person UUID</dt>
          <dd>{{ item.personUuid }}</dd>
        </dl>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('accounts');
const { mapState: mapPluginState } = createNamespacedHelpers('plugins');

export default {
  layout: 'crud',
  data: () => ({
    headers: [
      { text: 'Native ID', value: 'nativeId', align: 'start' },
      { text: 'Plugin Name', value: 'pluginName' },
      { text: 'Actions', value: 'actions', sortable: false, width: '7em' },
      { text: '', value: 'data-table-expand' },
    ],
    // is the dialog visible?
    dialog: false,
    // is the dialog editing an existing item?
    editing: false,
    editedItem: {
      nativeId: '{}',
      pluginUuid: '',
    },
    defaultItem: {
      nativeId: '{}',
      pluginUuid: '',
    },
  }),

  async fetch({ store }) {
    await Promise.all([
      store.dispatch('plugins/initialize'),
      store.dispatch('accounts/initialize'),
    ]);
  },

  computed: {
    ...mapState({
      items: 'list',
    }),
    ...mapPluginState({
      plugins: 'list',
      pluginMap: 'map',
    }),
    formTitle() {
      return this.editedIndex === -1 ? 'New Account' : 'Edit Account';
    },
  },

  watch: {
    dialog(val) {
      if (!val) {
        this.close();
      }
    },
  },

  methods: {
    ...mapActions(['create', 'update', 'delete']),

    getPluginName(account) {
      return this.pluginMap.get(account.pluginUuid)?.name ?? account.pluginUuid;
    },

    editItem(item) {
      const { uuid, pluginUuid, personUuid } = item;
      const nativeId = JSON.stringify(item.nativeId);
      this.editedItem = { uuid, nativeId, pluginUuid, personUuid };

      this.dialog = true;
      this.editing = true;
    },

    async save() {
      const { uuid, pluginUuid, personUuid } = this.editedItem;
      const nativeId = JSON.parse(this.editedItem.nativeId);

      const item = { uuid, nativeId, pluginUuid, personUuid };

      if (this.editing) {
        await this.update(item);
      } else {
        await this.create(item);
      }
      this.close();
    },

    async deleteItem(item) {
      if (confirm('Are you sure you want to delete this account?')) {
        await this.delete(item);
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editing = false;
      });
    },
  },
};
</script>

<style>
dl {
  margin: 6px 0 6px 6px;
}

@media (min-width: 599px) {
  dl {
    display: grid;
    grid-template-columns: 160px auto;
  }
}

dt {
  font-weight: bold;
}

dt,
dd {
  margin: 6px 0;
}
</style>
