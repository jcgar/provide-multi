# provide-crud

[![build status](https://img.shields.io/travis/loggur/provide-crud/master.svg?style=flat-square)](https://travis-ci.org/loggur/provide-crud) [![npm version](https://img.shields.io/npm/v/provide-crud.svg?style=flat-square)](https://www.npmjs.com/package/provide-crud)
[![npm downloads](https://img.shields.io/npm/dm/provide-crud.svg?style=flat-square)](https://www.npmjs.com/package/provide-crud)

Provider factory for Creating, Reading, Updating, and Deleting resources.


## Table of contents

1.  [Installation](#installation)
2.  [Usage](#usage)
3.  [Example](#example)
4.  [Real world example](#real-world-example)
5.  [Protip](#protip)


## Installation

```
npm install provide-crud --save
```


## Usage

### provideCrud (String name, Optional Object init, Optional Object replication, Optional Array clientStateKeys)

Creates a provider with namespaced actions and reducers specific to [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete).

The `init` object should contain a map of the unprefixed `reducerKeys` to their initial states.  Each key will be prefixed (namespaced) with the `name` and become each `reducerKey` and will have actions which can be used to set each state.  The only reserved keys for this object are `id` (defaults to empty string) and `deleted` (defaults to false).  You can set a different default `id` or `deleted` initial state by including your own within this object, if necessary.

Sane defaults are added to the `replication` object if they're undefined.  All `reducerKeys` are replicated and `queryable` by default.  And the `baseQuery` ensures that only instances which have not been deleted are queried by default.

The [provider `key`](https://github.com/loggur/react-redux-provide#key) also defaults to:
```js
const key = ({ props }) => props[idKey] ? `${idKey}=${props[idKey]}` : null;
```

You can override this `key` by simply setting it on the created provider object afterwards, if necessary.


## Example

Let's create a `test` provider, with `testFoo` and `testBar` as states to be created/updated/deleted.  The `testFoo` state will default to "foo", and the `testBar` state will default to "bar".

```js
// src/providers/test.js

import provideCrud from 'provide-crud';

const test = provideCrud('test', {
  foo: 'foo',
  bar: 'bar'
});

export default test;
```

You'll then have a provider with the following actions:

- `createTest (Object state, Function genId, Optional Function onSuccess)`
- `updateTest (Object updates, Optional Function onSuccess)`
- `deleteTest (Optional Function onSuccess)`
- `undeleteTest (Optional Function onSuccess)`
- `setTestFoo (Mixed testFoo)`
- `setTestBar (Mixed testBar)`

And reducers:

- `testId`
- `testDeleted`
- `testFoo`
- `testBar`


## Real world example

See [`provide-user`](https://github.com/loggur/provide-user).  Also see [Lumbur's user login component](https://github.com/loggur/lumbur/blob/master/src/components/UserLogIn.js) for an example where this is used.


## Protip

Use [`provide-id-gen`](https://github.com/loggur/provide-id-gen) for your `genId` argument when creating an instance!
