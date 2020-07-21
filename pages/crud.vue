<template>
  <div>
    <button @click="createPlugin()">Create Plugin</button>
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
  </div>
</template>

<script>
export default {
  layout: 'crud',
  data() {
    return {
      plugins: [],
    };
  },
  async asyncData({ $axios }) {
    const plugins = await $axios.$get('/api/plugin/');
    console.log('fetched', plugins);
    return { plugins };
  },
  methods: {
    async createPlugin() {
      const plugin = await this.$axios.$post('/api/plugin/', {
        name: 'dummy',
        config: { foo: 0 },
      });
      console.log('created', plugin);
    },
  },
};
</script>
