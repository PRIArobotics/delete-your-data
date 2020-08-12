import { isWebUri } from 'valid-url';
import axios from 'axios';

/**
 * The dummy plugin connects to DYD dummy service, which in turn manages a number of accounts
 * identified by a username, and a number of entries for each account with text content.
 *
 * The service makes its capabilities available via a Rest API.
 */
export default class DummyPlugin {
  static TYPE_NAME = 'Dummy';

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

    if (isWebUri(apiUrl)) {
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

  // All methods above must not access external resources; they do data validation only.
  // This should allow them to be used client-side.

  // The methods below can access databases etc.
  // The `mode` parameter must be either `DELETE` or `ANONYMIZE`, and specifies whether records
  // in the referenced data store are to be deleted or only cleared of personal information.
  // Plugins may throw an exception for either mode, if only one is supported.
  // DYD will pass log entry locations to `redactEntries` in reverse chronological order.
  // However, DYD may also instruct a plugin to only delete a subset of all of an account's
  // log entries. Plugins can therefore not rely on all subsequent entries to already be redacted.

  // The methods are not required to cascade, i.e. DYD will only ask a plugin to redact an account
  // after redacting (with the same mode) all log entries belonging to that account.
  // If there is account information that is not tracked in DYD log entries (not recommended),
  // the plugin needs to properly cascade through all that data, though.

  async redactAccounts(ids, mode) {
    console.log(this, mode, 'accounts', ids);
    // TODO error handling. what if one request fails early; what happens to others?
    await Promise.all(ids.map((id) => axios.delete(`${this.apiUrl}/account/${id}`)));
  }

  async redactEntries(locations, mode) {
    console.log(this, mode, 'entries', locations);
    // TODO
  }
}
