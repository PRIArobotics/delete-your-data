<template>
  <v-app id="keep">
    <v-app-bar app clipped-left color="grey darken-3">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5"><span class="font-weight-light">Delete Your</span> Data</span>
      <v-text-field solo-inverted flat hide-details label="Search" prepend-inner-icon="mdi-magnify" v-model="searchTerm" @change="searchPlugin"/>
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
          <v-divider v-else-if="item.divider" :key="i"/>
          <v-list-item v-else :key="i" link>
            <v-list-item-action>
              <v-icon class="black--text">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title @click="openCRUD( item.info )"  class="black--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <template>
        <v-expansion-panels>
          <v-expansion-panel v-for="plugin in plugins" :key="plugin.uuid">
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4">{{plugin.name}}</v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open">Config File:</span>
                    <v-row v-else no-gutters style="width: 100%">
                      <v-col cols="12" centered>UUID: {{ plugin.uuid }}</v-col>
                    </v-row>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ plugin.config }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-content>
  </v-app>
</template>

<script>
//import Models from '~/server/models.js' // missing dependencies?
/*These dependencies were not found:
 * aws-sdk
 * child_process
 * fs
 * net
 * tls
To install them, you can run: npm install --save aws-sdk child_process fs net tls
*/


export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    searchTerm: '',
    plugins: [
      {uuid: null, name: null, config: null}
    ],
    items: [
      { icon: 'mdi-database-plus', text: 'Create Plugin', info: 'create'},
      { divider: true },
      { icon: 'mdi-database-sync', text: 'Update Plugin', info: 'update'},
      { divider: true },
      { icon: 'mdi-delete', text: 'Delete Plugin', info: 'delete'},
    ],
  }),
  methods:{
    openCRUD: (openWhat) => {
      alert(openWhat)
    },
    searchPlugin: function() {
      alert(searchTerm)
    }
  }
}
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>
