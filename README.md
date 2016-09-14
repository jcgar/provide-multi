# provide-multi

[![build status](https://img.shields.io/travis/jcgar/provide-multi/master.svg?style=flat-square)](https://travis-ci.org/jcgar/provide-multi) [![npm version](https://img.shields.io/npm/v/provide-multi.svg?style=flat-square)](https://www.npmjs.com/package/provide-multi)
[![npm downloads](https://img.shields.io/npm/dm/provide-multi.svg?style=flat-square)](https://www.npmjs.com/package/provide-multi)

Provider factory for creating multiple instances of another provider.


## Table of contents

1.  [Installation](#installation)
2.  [Usage](#usage)
3.  [Example](#example)
4.  [References](#references)


## Installation

```
npm install provide-multi --save
```


## Usage

### provideMulti (Object props)

The `props` object must contain the following keys:

- `name` (String) - Suffix used (in proper form) for namespaced actions (Eg: 'counter' will generate 'addCounter' and 'removeCounter')
- `provider` (Object) - Provider object with 'actions' and 'reducers' keys
- `actionTypes` (Object) - Enumeration of all action strings exported by the provider (Eg: { INCREMENT, DECREMENT })
- `initialState` (Object) - Initial state exported by the provider


This will generate a provider with an add/remove action, and one action for every one that our single provider has (Eg: increment, decrement). These copied actions receive an index as parameted, and return the dispatch function.

Also, every reducer will be replicated with a 'Multi' suffix, holding an array of single reducers.


## Example

- Refer action in single provider
```js
<MyElement onClick={increment}) />
```
- Refer action in in multi provider, for instance index '0'
```js
<MyElement onClick={increment(0)}) />
```
- Dispatch action in single provider
```js
onClick => () { increment(); }
```
- Dispatch action in multi provider, for instance index '0'
```js
onClick => () { increment(0)(); }
```


Provider definition:

```js
// test/counter-multi.js

import provideMulti from 'provide-multi';
import counter, { INCREMENT, DECREMENT, INITIAL_STATE } from './counter';

const counterMulti = provideMulti({
  name: 'counter',
  provider: counter,
  actionTypes: { INCREMENT, DECREMENT },
  initialState: INITIAL_STATE,
});

export default counterMulti;
```


Example counter provider used to add multiple instance functionality:

```js
// test/counter.js

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const INITIAL_STATE = {
  value: 0
}
const update = (state, mutations) =>
  Object.assign({}, state, mutations)

const actions = {
  increment() {
    return { type: INCREMENT };
  },
  decrement() {
    return { type: DECREMENT };
  }
}

const reducers = {
  counter(state = INITIAL_STATE, action) {
    switch (action.type) {
      case INCREMENT:
        state = update(state, { value: state.value + 1 });
        break;
      case DECREMENT:
        state = update(state, { value: state.value - 1 });
        break;
      default:
        return state;
    }
    return state;
  }
}

export default {
  actions, reducers
};
```
You'll then have a provider with the following actions:

- `addCounter ()` - Adds an instance to our multiple counter provider
- `removeCounter ()` - Removes an instance to our multiple counter provider
- `increment (Int index)` - Returns a function which is equivalent to the single provider action (not dispatched until executed)
- `decrement (Int index)` - Returns a function which is equivalent to the single provider action (not dispatched until executed)

And reducers:

- `counters`


## References
- [Applying redux reducers to arrays](http://blog.scottlogic.com/2016/05/19/redux-reducer-arrays.html)
- [React redux provide](https://github.com/loggur/react-redux-provide)
