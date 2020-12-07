# Delete Your Data

> for general information on what DYD is, look in the [repository root](../README.md).

**Delete Your Data (DYD)** helps platform providers in granting their users' rights to information, access, rectification, and erasure of their data.

This directory is the main DYD application.
To host and use DYD, clone or copy it, configure the database and any plugins you need, and then deploy it on your systems.

## Prerequisites

Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Configuration

Before using DYD, two pieces of configuration must be given: database connection, and plugins.
The database config resides [here](../server/models/index.js) and the setup options can be looked up in the [Sequelize documentation](https://sequelize.org/v5/manual/getting-started.html#setting-up-a-connection).

DYD depends on plugins to connect to specific external systems.
To have a plugin available, it must be added as a dependency via Yarn and added to the [plugin registry](plugins/dydPluginRegistry.js).

After that, DYD can be started and deployed as described above.

## Concepts

DYD operates on four main concepts: systems/plugins, people, accounts, and log entries.

- A system stores personal data, and the plugin corresponding to that system gives DYD the capability to request anonymization and deletion of data stored in that system.
  Each system is identified by a UUID.
- A person is one human being, only identified by a UUID.
- An account is the thing that identifies a person within one system.
  The same person can have multiple accounts, often one per system.
  An account's `nativeId` (an arbitrary JSON object) stores the thing that identifies the account within the system.
  Within DYD, the account is also identified by a UUID, separately from the person UUID.
- A log entry is a bit of data that is connected to an account, stored in that account's system.
  An entry's `nativeLocation` (an arbitrary JSON object) stores the thing that identifies and locates that bit of data within the system.
  Within DYD, the entry is also identified by an auto-increment ID.

In DYD, redaction happens in two steps:
first all pieces of data (accounts and log entries) that need redaction are gathered, then that data is deleted by dispatching requests to the appropriate plugins.
DYD recognizes two modes of redaction:

- `'DELETE'`: the data is deleted completely from the system, without any metadata about the data remaining.
- `'ANONYMIZE'`: all personal information within the data is redacted, but metadata and/or nonpersonal information at that location stays in place.

Whether only one or both modes of redaction are available to users is up to the platform provider, and implementing these modes properly is up to the plugin developer.
DYDs role in this is that the plugins are given a correct and complete list of all data points that need to be redacted.
In particular:

- When redacting accounts, DYD will cascade and first redact all log entries associated with those accounts. After that, DYD will pass the list of `nativeId`s to the plugin.
- When redacting log entries, DYD will pass the list of `nativeLocation`s to the plugin in reverse order of creation.
  This can simplify plugin implementation for simple cases, where deleting data in reverse order is enough to ensure that no database constraints are violated.
- Generally, DYD will batch commands to the same plugin.
  E.g. redacting two accounts belonging to the same system, DYD will combine the entries associated with both and call the plugin once for their entirety.
- DYD will call different plugins in parallel.

Regardless of the mode of redaction, DYD will delete its own database entries that correspond to the redacted data as part of the redaction process:
their sole purpose is to identify other data for querying or deletion, which is at that point fulfilled.

## Indexing APIs

DYD offers the following REST APIs that are meant for access by systems:

- `POST /api/account`: Indexes an account that was created in a system.
  The new account will be assigned a newly generated account UUID.
  - `pluginUuid`: UUID of the plugin for the system that stores the account
  - `personUuid`: UUID of the person this account belongs to.
    If not given, a new UUID is created and the account is therefore not connected to an existing person.
    If given, the UUID does not *have* to belong to an existing person, so if generating the new person UUID in the connecting system is preferred, that is possible.
  - `nativeId`: arbitrary JSON object that identifies the account within the system.

- `PATCH /api/plugin/:pluginUuid/account/:nativeId`: Updates the `nativeId` for the account identified by `pluginUuid` and `nativeId`.
  - `:pluginUuid`: UUID of the plugin for the system that stores the account
  - `:nativeId`: JSON object currently identifying the account within the system;
    must be [stringified](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [URI component encoded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).
  - `nativeId`: arbitrary JSON object that identifies the account within the system.

  Note that if your system requires this route, it's likely because the `nativeId` can be changed by the user (e.g. a username or email address).
  This means that personal data resides within the DYD index.
  In this case, it is *necessary* to delete the DYD account to completely remove personal data, e.g. by the route below or by redacting the account via DYD.

- `DELETE /api/plugin/:pluginUuid/account/:nativeId`: Deletes the account identified by `pluginUuid` and `nativeId`.
  This does not redact all the user's content, it means that your system wants DYD to forget about that user.
  This operation does not cascade, so all log entries associated with that account need to be removed first.
  - `:pluginUuid`: UUID of the plugin for the system that stores the account
  - `:nativeId`: JSON object identifying the account within the system;
    must be [stringified](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [URI component encoded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).

- `POST /api/log`: Indexes a log entry that was created in a system.
  - `accountUuid`: UUID of the account this log entry belongs to.
  - `nativeLocation`: arbitrary JSON object that identifies the log entry within the system.
    The `nativeLocation` alone has to be enough to identify the data item in the system;
    if necessary, it has to incorporate the relevant parts of the account's `nativeId`.

- `PATCH /api/plugin/:pluginUuid/log/:nativeLocation/`: Updates the `accountUuid` and `nativeLocation` for the log entry identified by `pluginUuid` and `nativeLocation`.
  - `:pluginUuid`: UUID of the plugin for the system that stores the entry
  - `:nativeLocation`: JSON object currently identifying the log entry within the system;
    must be [stringified](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [URI component encoded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).
  - `nativeLocation`: arbitrary JSON object that identifies the account within the system.

  Note that if your system requires this route, it's likely because the `nativeLocation` can be changed by the user (e.g. a user-chosen title or file name).
  This means that personal data resides within the DYD index.
  In this case, it is *necessary* to delete the DYD log entry to completely remove personal data, e.g. by the route below or by redacting the account via DYD.

- `DELETE /api/plugin/:pluginUuid/log/:nativeLocation`: Deletes the log entry identified by `pluginUuid` and `nativeId`.
  This does not redact the log entry's content, it means that your system wants DYD to forget about that log entry.
  - `:pluginUuid`: UUID of the plugin for the system that stores the entry
  - `:nativeId`: JSON object identifying the log entry within the system;
    must be [stringified](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [URI component encoded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).

## Redaction APIs

The following REST APIs will delete data from connected systems.
These APIs are used by the admin UI, but can also be accessed by authorized systems to allow users to delete their data without admin intervention.

See [above](#concepts) on what a redaction request entails.

- `POST /api/account/redact`: Redacts the accounts identified in the request.
  - `mode`: the redaction mode; `'DELETE'` or `'ANONYMIZE'`
  - `accounts`: array of UUIDs of the accounts that should be redacted.

- `POST /api/person/redact`: Redacts the people identified in the request.
  - `mode`: the redaction mode; `'DELETE'` or `'ANONYMIZE'`
  - `persons`: array of UUIDs of the persons that should be redacted.

- `POST /api/log/redact`: Redacts the log entries identified in the request.
  - `mode`: the redaction mode; `'DELETE'` or `'ANONYMIZE'`
  - `entries`: array of UUIDs of the log entries that should be redacted.
