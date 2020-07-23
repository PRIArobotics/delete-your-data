<template>
  <v-app dark class="keep">
    <v-app-bar app clipped-left color="grey darken-3">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5"> <span class="font-weight-light">Delete Your</span> Data </span>
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search"
        prepend-inner-icon="mdi-magnify"
        v-model="searchTerm"
        @keyup="searchPlugin"
      />
      <v-spacer />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-3">
      <v-list dense class="grey lighten-3">
        <template v-for="(item, i) in items">
          <v-row v-if="item.heading" :key="i" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading" class="black--text">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn small text>edit</v-btn>
            </v-col>
          </v-row>
          <v-divider v-else-if="item.divider" :key="i" />
          <v-list-item v-else :key="i" link>
            <v-list-item-action>
              <v-icon class="black--text">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title @click="openCRUD(item.info)" class="black--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    searchTerm: '',
    items: [
      { icon: 'mdi-database-plus', text: 'Create Plugin', info: 'create' },
      { divider: true },
      { icon: 'mdi-database-sync', text: 'Update Plugin', info: 'update' },
      { divider: true },
      { icon: 'mdi-delete', text: 'Delete Plugin', info: 'delete' },
    ],
  }),
  methods: {
    openCRUD(openWhat) {
      alert(openWhat);
    },
    searchPlugin() {
      alert(this.searchTerm);
    },
  },
};
</script>

<style>
.keep .v-navigation-drawer__border {
  display: none;
}
</style>
