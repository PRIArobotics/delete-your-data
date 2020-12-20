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
          <v-list-item v-else :key="i" :to="item.url">
            <v-list-item-action>
              <v-icon class="black--text">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="black--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    searchTerm: '',
    items: [
      { icon: 'mdi-puzzle', text: 'Plugin', url: '/plugins' },
      { divider: true },
      { icon: 'mdi-account', text: 'Account', url: '/accounts' },
      { divider: true },
      { icon: 'mdi-inbox-multiple', text: 'Log', url: '/log' },
      { divider: true },
      { icon: 'mdi-security', text: 'Token', url: '/tokens' },
      { divider: true },
      { icon: 'mdi-lock-open', text: 'Access', url: '/access' },
    ],
  }),
  methods: {
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
