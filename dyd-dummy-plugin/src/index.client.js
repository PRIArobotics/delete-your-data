import { isWebUri } from 'valid-url';

/**
 * The dummy plugin connects to DYD dummy service, which in turn manages a number of accounts
 * identified by a username, and a number of entries for each account with text content.
 *
 * The service makes its capabilities available via a Rest API.
 */
export default class DummyPlugin {
  static TYPE_NAME = 'Dummy';

  // All methods here must not access external resources; they do data validation only.
  // This should allow them to be used client-side.

  /**
   * Check that the passed value is a valid DummyPlugin config.
   */
  static validateConfig(config) {
    const { apiUrl, ...rest } = config;

    const restEntries = Object.entries(rest);
    if (restEntries.length !== 0) {
      const msg = restEntries.map(([key, value]) => `${key}=${value}`).join(', ');
      throw new Error(`config has unexpected entries: ${msg}`);
    }

    if (!isWebUri(apiUrl)) {
      throw new Error(`apiUrl must be a legal http or https URL`);
    }
  }

  constructor({ apiUrl }) {
    this.apiUrl = apiUrl;
  }

  /**
   * Check that the passed value is a valid DummyPlugin account ID.
   * This plugin expects the ID to be a username, i.e. a string.
   */
  validateAccountId(id) {
    if (typeof id !== 'string') throw new Error(`account id must be a string`);
  }

  /**
   * Check that the passed value is a valid DummyPlugin location description.
   * This plugin expects the location to be an integer.
   */
  validateLocation(location) {
    if (typeof location !== 'number') throw new Error(`account id must be a number`);
  }
}
