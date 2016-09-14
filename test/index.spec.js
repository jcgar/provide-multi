import { instantiateProvider } from 'react-redux-provide';
import expect from 'expect';

import provideMulti from '../src/index';
import counter, { INCREMENT, DECREMENT, INITIAL_STATE } from './counter';


const test = provideMulti({
  name: 'counter',
  provider: counter,
  actionTypes: { INCREMENT, DECREMENT },
  initialState: INITIAL_STATE,
});

const testInstance = instantiateProvider(
  { props: {} },
  test
);

const { store, actionCreators } = testInstance;

describe('provide-multi', () => {


  it('should provide a namespaced `add${Name}` action', () => {
    expect(typeof testInstance.actions.addCounter).toBe('function');
  });

  it('should provide a namespaced `remove${Name}` action', () => {
    expect(typeof testInstance.actions.removeCounter).toBe('function');
  });

  it('should provide namespaced `${reducer}Multi` reducers with the correct initial state (empty array)', () => {
    expect(store.getState().counterMulti).toEqual([]);
  });

  it('should properly add an instance', () => {
    testInstance.actionCreators.addCounter();
    expect(store.getState().counterMulti).toEqual([INITIAL_STATE]);
  });
  it('should properly add a second instance', () => {
    testInstance.actionCreators.addCounter();
    expect(store.getState().counterMulti).toEqual([INITIAL_STATE, INITIAL_STATE]);
  });
  it('should properly remove the instances', () => {
    testInstance.actionCreators.removeCounter();
    expect(store.getState().counterMulti).toEqual([INITIAL_STATE]);
    testInstance.actionCreators.removeCounter();
    expect(store.getState().counterMulti).toEqual([]);
  });
  it('should properly remove an instance when there are no instances', () => {
    testInstance.actionCreators.removeCounter();
    expect(store.getState().counterMulti).toEqual([]);
  });
  it('should properly execute all actions', () => {
      testInstance.actionCreators.addCounter();
      testInstance.actionCreators.increment(0)();
      expect(store.getState().counterMulti).toEqual([{value: 1,warning: false}]);
      testInstance.actionCreators.decrement(0)();
      expect(store.getState().counterMulti).toEqual([{value: 0,warning: false}]);
      testInstance.actionCreators.decrement(0)();
      expect(store.getState().counterMulti).toEqual([{value: -1,warning: false}]);
      testInstance.actionCreators.removeCounter();
  });
  it('should properly execute an action in two different instances', () => {
    testInstance.actionCreators.addCounter();
    testInstance.actionCreators.addCounter();
    testInstance.actionCreators.increment(0)();
    expect(store.getState().counterMulti).toEqual([{value: 1,warning: false},{value: 0, warning: false}]);
    testInstance.actionCreators.increment(0)();
    expect(store.getState().counterMulti).toEqual([{value: 2,warning: false},{value: 0, warning: false}]);
    testInstance.actionCreators.increment(1)();
    expect(store.getState().counterMulti).toEqual([{value: 2,warning: false},{value: 1, warning: false}]);
    testInstance.actionCreators.increment(1)();
    expect(store.getState().counterMulti).toEqual([{value: 2,warning: false},{value: 2, warning: false}]);
    testInstance.actionCreators.increment(0)();
    expect(store.getState().counterMulti).toEqual([{value: 3,warning: false},{value: 2, warning: false}]);
    testInstance.actionCreators.removeCounter();
    testInstance.actionCreators.removeCounter();
  });
  it('should properly ignore an out of bounds indexed action', () => {
    testInstance.actionCreators.addCounter();
    testInstance.actionCreators.addCounter();
    testInstance.actionCreators.increment(0)();
    expect(store.getState().counterMulti).toEqual([{value: 1,warning: false},{value: 0, warning: false}]);
    testInstance.actionCreators.increment(2)();
    expect(store.getState().counterMulti).toEqual([{value: 1,warning: false},{value: 0, warning: false}]);
    testInstance.actionCreators.increment(-1)();
    expect(store.getState().counterMulti).toEqual([{value: 1,warning: false},{value: 0, warning: false}]);
    testInstance.actionCreators.increment(1)();
    expect(store.getState().counterMulti).toEqual([{value: 1,warning: false},{value: 1, warning: false}]);
    testInstance.actionCreators.removeCounter();
    testInstance.actionCreators.removeCounter();
  });
});
