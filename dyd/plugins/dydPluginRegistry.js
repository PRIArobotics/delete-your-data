import DummyPlugin from 'dyd-dummy-plugin';
import MakersPlugin from 'dyd-makers-plugin';

// specify DYD plugins to use
export const plugins = [
  DummyPlugin,
  MakersPlugin,
];

// plugins indexed by their names
export const pluginRegistry = {};
for (const pluginType of plugins) {
  pluginRegistry[pluginType.TYPE_NAME] = pluginType;
}

export default (context, inject) => {
  inject('dydPlugins', plugins);
  context.$dydPlugins = plugins;
  inject('dydPluginRegistry', pluginRegistry);
  context.$dydPluginRegistry = pluginRegistry;
};
