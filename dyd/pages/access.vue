<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="pluginuuid"
    item-key="uuid"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Access</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Access</v-btn>
          </template>
          <v-card>
            <v-form @submit.prevent="save">
              <v-card-title>
                <span class="headline">New Access</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.tokenUuid"
                        :items="tokens"
                        item-text="description"
                        item-value="uuid"
                        label="Token UUID"
                        single-line
                      >
                      </v-select>
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
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>

    <template v-slot:item.pluginName="{ item }">
      {{ getPluginName(item) }}
    </template>
    <template v-slot:item.description="{ item }">
      {{ getTokenDescription(item) }}
    </template>
  </v-data-table>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('access');
const { mapState: mapPluginState } = createNamespacedHelpers('plugins');
const { mapState: mapTokenState } = createNamespacedHelpers('tokens');

export default {
  data: () => ({
    headers: [
      { text: 'Token', value: 'description', align: 'start' },
      { text: 'Plugin Name', value: 'pluginName' },
      { text: 'Actions', value: 'actions', sortable: false, width: '7em' },
    ],
    // is the dialog visible?
    dialog: false,
    editedItem: {
      pluginUuid: '',
      tokenUuid: '',
    },
    defaultItem: {
      pluginUuid: '',
      tokenUuid: '',
    },
  }),

  async fetch({ store }) {
    await Promise.all([
      store.dispatch('plugins/initialize'),
      store.dispatch('tokens/initialize'),
      store.dispatch('access/initialize'),
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
    ...mapTokenState({
      tokens: 'list',
      tokenMap: 'map',
    }),
  },

  watch: {
    dialog(val) {
      if (!val) {
        this.close();
      }
    },
  },

  methods: {
    ...mapActions(['create', 'delete']),

    getPluginName(access) {
      return this.pluginMap.get(access.pluginUuid)?.name ?? access.pluginUuid;
    },

    getTokenDescription(access) {
      return this.tokenMap.get(access.tokenUuid)?.description ?? access.tokenUuid;
    },

    async save() {
      const { pluginUuid, tokenUuid } = this.editedItem;

      const item = { pluginUuid, tokenUuid };

      await this.create(item);

      this.close();
    },

    async deleteItem(item) {
      if (confirm('Are you sure you want to delete this access?')) {
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
