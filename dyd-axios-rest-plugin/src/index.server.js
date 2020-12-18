import axios from 'axios';

import BrowserAxiosRestPlugin from './index.client';

/**
 * The dummy plugin connects to DYD dummy service, which in turn manages a number of accounts
 * identified by a username, and a number of entries for each account with text content.
 *
 * The service makes its capabilities available via a Rest API.
 */
export default class AxiosRestPlugin extends BrowserAxiosRestPlugin {
  constructor({ baseURL, accountEndpoint, accountMethod, entryEndpoint, entryMethod }) {
    super({ baseURL, accountEndpoint, accountMethod, entryEndpoint, entryMethod });

    this.axios = axios.create({ baseURL });
  }

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
    await this.axios.request({
      url: this.accountEndpoint,
      method: this.accountMethod,
      data: { ids, mode },
    });
  }

  async redactEntries(locations, mode) {
    await this.axios.request({
      url: this.entryEndpoint,
      method: this.entryMethod,
      data: { locations, mode },
    });
  }
}
