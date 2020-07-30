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
                    <v-text-field v-model="editedItem.type" label="Plugin Type"></v-text-field>
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
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
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
export default {
  layout: 'crud',
  data: () => ({
    dialog: false,
    headers: [
      { text: 'Name', value: 'name', align: 'start' },
      { text: 'Type', value: 'type' },
      // { text: 'ID', value: 'uuid' },
      // { text: 'Config JSON', value: 'config' },
      { text: 'Actions', value: 'actions', sortable: false, width: '7em' },
      { text: '', value: 'data-table-expand' },
    ],
    items: [],
    editedIndex: -1,
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

  async asyncData({ $axios }) {
    const items = await $axios.$get('/api/plugin/');
    return { items };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Plugin' : 'Edit Plugin';
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
    editItem(item) {
      const { uuid, name, type } = item;
      const config = JSON.stringify(item.config);

      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { uuid, name, type, config };
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.items.indexOf(item);
      const confirmed = confirm('Are you sure you want to delete this plugin?');
      if (confirmed) {
        await this.$axios.$delete(`/api/plugin/${item.uuid}`);
        this.items.splice(index, 1);
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    async save() {
      const { uuid, name, type } = this.editedItem;
      const config = JSON.parse(this.editedItem.config);

      if (this.editedIndex > -1) {
        await this.$axios.$put(`/api/plugin/${uuid}`, { name, type, config });
        Object.assign(this.items[this.editedIndex], { name, type, config });
      } else {
        const plugin = await this.$axios.$post('/api/plugin/', { name, type, config });
        this.items.push(plugin);
      }
      this.close();
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

dt, dd {
  margin: 6px 0;
}
</style>