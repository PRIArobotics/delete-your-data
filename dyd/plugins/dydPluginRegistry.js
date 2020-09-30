import DummyPlugin from 'dyd-dummy-plugin';

// specify DYD plugins to use
export const plugins = {
  [DummyPlugin.TYPE_NAME]: DummyPlugin,
};

export default (context, inject) => {
  inject('dydPlugins', plugins);
  context.$dydPlugins = plugins;
};
