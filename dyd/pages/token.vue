<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="description"
    item-key="uuid"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Tokens</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Token</v-btn>
          </template>
          <v-card>
            <v-form @submit.prevent="save">
              <v-card-title>
                <span class="headline">New Token</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
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
  </v-data-table>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('tokens');

export default {
  layout: 'crud',
  data: () => ({
    headers: [
      { text: 'UUID', value: 'uuid', align: 'start' },
      { text: 'Description', value: 'description' },
      // { text: 'ID', value: 'uuid' },
      // { text: 'Config JSON', value: 'config' },
      { text: 'Actions', value: 'actions', sortable: false, width: '7em' },
    ],
    // is the dialog visible?
    dialog: false,
    editedItem: {
      description: '',
    },
    defaultItem: {
      description: '',
    },
  }),

  async fetch({ store }) {
    await store.dispatch('tokens/initialize');
  },

  computed: {
    ...mapState({
      items: 'list',
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

    async save() {
      const { description } = this.editedItem;

      const item = { description };

      await this.create(item);

      this.close();
    },

    async deleteItem(item) {
      if (confirm('Are you sure you want to delete this Token?')) {
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
