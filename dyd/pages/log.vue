<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="createdAt"
    item-key="id"
    show-expand
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Log</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Log</v-btn>
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
                      <v-text-field
                        v-model="editedItem.nativeLocation"
                        label="Native Location"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.accountUuid"
                        label="Account UUID"
                      ></v-text-field>
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

    <template v-slot:item.nativeLocation="{ item }">
      {{ JSON.stringify(item.nativeLocation) }}
    </template>

    <template v-slot:item.createdAt="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <dl>
          <dt>ID</dt>
          <dd>{{ item.id }}</dd>
          <dt>Updated Timestamp</dt>
          <dd>{{ new Date(item.updatedAt).toLocaleString() }}</dd>
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
      { text: 'Created', value: 'createdAt', align: 'start' },
      { text: 'Native Location', value: 'nativeLocation', align: 'start' },
      { text: 'Account UUID', value: 'accountUuid' },
      { text: 'Actions', value: 'actions', sortable: false, width: '7em' },
      { text: '', value: 'data-table-expand' },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      nativeLocation: '{}',
      accountUuid: '',
    },
    defaultItem: {
      nativeLocation: '{}',
      accountUuid: '',
    },
  }),

  async asyncData({ $axios }) {
    const items = await $axios.$get('/api/log/');
    return { items };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Log' : 'Edit Log';
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
      const { id, accountUuid } = item;
      const nativeLocation = JSON.stringify(item.nativeLocation);

      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { id, nativeLocation, accountUuid };
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.items.indexOf(item);
      const confirmed = confirm('Are you sure you want to delete this account?');
      if (confirmed) {
        await this.$axios.$delete(`/api/log/${item.id}`);
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
      const { id, accountUuid } = this.editedItem;
      const nativeLocation = JSON.parse(this.editedItem.nativeLocation);

      if (this.editedIndex > -1) {
        await this.$axios.$put(`/api/log/${id}`, { nativeLocation, accountUuid });
        Object.assign(this.items[this.editedIndex], { nativeLocation, accountUuid });
      } else {
        const account = await this.$axios.$post('/api/log/', { nativeLocation, accountUuid });
        this.items.push(account);
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

dt,
dd {
  margin: 6px 0;
}
</style>
