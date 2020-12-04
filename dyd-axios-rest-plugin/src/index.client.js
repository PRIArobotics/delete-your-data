import { isWebUri } from 'valid-url';

/**
 * The dummy plugin connects to DYD dummy service, which in turn manages a number of accounts
 * identified by a username, and a number of entries for each account with text content.
 *
 * The service makes its capabilities available via a Rest API.
 */
export default class AxiosRestPlugin {
  static TYPE_NAME = 'AxiosRest';

  // All methods here must not access external resources; they do data validation only.
  // This should allow them to be used client-side.

  /**
   * Check that the passed value is a valid DummyPlugin config.
   */
  static validateConfig(config) {
    const { baseURL, accountEndpoint, accountMethod, entryEndpoint, entryMethod, ...rest } = config;

    const restEntries = Object.entries(rest);
    if (restEntries.length !== 0) {
      const msg = restEntries.map(([key, value]) => `${key}=${value}`).join(', ');
      throw new Error(`config has unexpected entries: ${msg}`);
    }

    if (!isWebUri(baseURL)) throw new Error(`apiUrl must be a legal http or https URL`);

    if (typeof accountEndpoint !== 'string') throw new Error(`accountEndpoint must be a string`);
    if (typeof (accountMethod ?? 'post') !== 'string')
      throw new Error(`accountMethod must be a string, if given`);

    if (typeof entryEndpoint !== 'string') throw new Error(`entryEndpoint must be a string`);
    if (typeof (entryMethod ?? 'post') !== 'string')
      throw new Error(`entryMethod must be a string, if given`);
  }

  constructor({ baseURL, accountEndpoint, accountMethod, entryEndpoint, entryMethod }) {
    this.baseURL = baseURL;
    this.accountEndpoint = accountEndpoint;
    this.accountMethod = accountMethod ?? 'post';
    this.entryEndpoint = entryEndpoint;
    this.entryMethod = entryMethod ?? 'post';
  }

  /**
   * Check that the passed value is a valid account ID.
   * This plugin performs no validation.
   */
  validateAccountId(_id) {}

  /**
   * Check that the passed value is a valid location description.
   * This plugin performs no validation.
   */
  validateLocation(_location) {}
}
