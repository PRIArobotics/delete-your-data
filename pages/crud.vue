<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="plugin in plugins" :key="plugin.uuid">
      <v-expansion-panel-header v-slot="{ open }">
        <v-row no-gutters>
          <v-col cols="4">{{ plugin.name }}</v-col>
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

<script>
//import sequalize from '~/server/models.js' // missing dependencies?
/*These dependencies were not found:
 * aws-sdk
 * child_process
 * fs
 * net
 * tls
To install them, you can run: npm install --save aws-sdk child_process fs net tls
*/

export default {
  layout: 'crud',
  data: () => ({
    plugins: [{ uuid: null, name: null, config: null }],
  }),
};
</script>
