<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="name"
    item-key="uuid"
    show-expand
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Plugins</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Plugin</v-btn>
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
                      <v-text-field v-model="editedItem.name" label="Plugin name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.type"
                        :items="$dydPlugins"
                        item-text="TYPE_NAME"
                        item-value="TYPE_NAME"
                        label="Plugin Type"
                        single-line
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.config" label="Config JSON"></v-text-field>
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
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <dl>
          <dt>UUID</dt>
          <dd>{{ item.uuid }}</dd>
          <dt>Config JSON</dt>
          <dd>
            <pre>{{ item.config }}</pre>
          </dd>
        </dl>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('plugins');

export default {
  data: () => ({
    headers: [
      { text: 'Name', value: 'name', align: 'start' },
      { text: 'Type', value: 'type' },
      // { text: 'ID', value: 'uuid' },
      // { text: 'Config JSON', value: 'config' },
      { text: 'Actions', value: 'actions', sortable: false, width: '7em' },
      { text: '', value: 'data-table-expand' },
    ],
    // is the dialog visible?
    dialog: false,
    // is the dialog editing an existing item?
    editing: false,
    editedItem: {
      name: '',
      type: '',
      config: '{}',
    },
    defaultItem: {
      name: '',
      type: '',
      config: '{}',
    },
  }),

  async fetch({ store }) {
    await store.dispatch('plugins/initialize');
  },

  computed: {
    ...mapState({
      items: 'list',
    }),
    formTitle() {
      return this.editing ? 'Edit Plugin' : 'New Plugin';
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

    editItem(item) {
      const { uuid, name, type } = item;
      const config = JSON.stringify(item.config);
      this.editedItem = { uuid, name, type, config };

      this.dialog = true;
      this.editing = true;
    },

    async save() {
      const { uuid, name, type } = this.editedItem;
      const config = JSON.parse(this.editedItem.config);

      const item = { uuid, name, type, config };

      if (this.editing) {
        await this.update(item);
      } else {
        await this.create(item);
      }
      this.close();
    },

    async deleteItem(item) {
      if (confirm('Are you sure you want to delete this plugin?')) {
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
