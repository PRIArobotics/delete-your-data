import { pluginRegistry } from '~/plugins/dydPluginRegistry.js';
import createApp, { host, port } from '~/server/app';

export default createApp(pluginRegistry);
