# Axios REST Plugin

> for general information on what DYD is, look in the [repository root](../README.md).

A DYD plugin for systems that can be instructed to anonymize/delete personal data on a REST endpoint,
based on the [Axios](https://github.com/axios/axios/) HTTP client.

## Configuration

```js
{
  // the base URL to which the endpoints are relative, required
  baseURL: 'https://example.com/api/',
  // the endpoint at which accounts can be deleted, required
  accountEndpoint: 'accounts/',
  // HTTP method for the account endpoint, defaults to 'post'
  accountMethod: 'post',
  // the endpoint at which log entries can be deleted, required
  entryEndpoint,
  // HTTP method for the entry endpoint, defaults to 'post'
  entryMethod,
}
```

## REST endpoint requirements

The account endpoint will receive data of the following shape:

```js
{
  ids: [nativeId, ...],
  mode: 'DELETE' | 'ANONYMIZE',
}
```

where each `nativeId` is the ID of an account as it is indexed by DYD.

The entry endpoint will receive data of the following shape:

```js
{
  locations: [nativeLocation, ...],
  mode: 'DELETE' | 'ANONYMIZE',
}
```

where each `nativeLocation` is the location of a log entry as it is indexed by DYD.

## Prerequisites

Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)

## Build Setup

``` bash
# install dependencies
$ yarn install

# build for production
$ yarn build
```
