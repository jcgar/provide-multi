import { instantiateProvider } from 'react-redux-provide';
import provideCrud from '../src/index';
import expect from 'expect';

const test = provideCrud('test', {
  foo: 'foo',
  bar: 'bar'
});

const testInstance = instantiateProvider(
  { props: { testId: '123' } },
  test
);

const { store, actionCreators } = testInstance;

describe('provide-crud', () => {
  it('should create the instance with the correct `providerKey`', () => {
    expect(testInstance.providerKey).toBe('testId=123');
  });

  it('should provide a namespaced `create` action', () => {
    expect(typeof testInstance.actions.createTest).toBe('function');
  });

  it('should provide a namespaced `update` action', () => {
    expect(typeof testInstance.actions.updateTest).toBe('function');
  });

  it('should provide a namespaced `delete` action', () => {
    expect(typeof testInstance.actions.deleteTest).toBe('function');
  });

  it('should provide a namespaced `undelete` action', () => {
    expect(typeof testInstance.actions.undeleteTest).toBe('function');
  });

  it('should provide a namespaced `deleted` reducer', () => {
    expect(typeof testInstance.reducers.testDeleted).toBe('function');
  });

  it(
    'should provide namespaced actions for setting each namespaced reducer',
    () => {
      expect(typeof testInstance.actions.setTestFoo).toBe('function');
      expect(typeof testInstance.actions.setTestBar).toBe('function');
    }
  );

  it('should provide namespaced reducers', () => {
    expect(typeof testInstance.reducers.testFoo).toBe('function');
    expect(typeof testInstance.reducers.testBar).toBe('function');
  });

  it('should have initialized with the correct states', () => {
    const state = store.getState();

    expect(state.testId).toBe('');
    expect(state.testFoo).toBe('foo');
    expect(state.testBar).toBe('bar');
    expect(state.testDeleted).toBe(false);
  });

  it('should properly create', () => {
    testInstance.actionCreators.createTest(
      { testFoo: 'FOO!', testBar: 'BAR!' },
      () => '123',
      state => {
        expect(state.testId).toBe('123');
        expect(state.testFoo).toBe('FOO!');
        expect(state.testBar).toBe('BAR!');
        expect(state.testDeleted).toBe(false);
      }
    );

    const state = store.getState();
    expect(state.testId).toBe('123');
    expect(state.testFoo).toBe('FOO!');
    expect(state.testBar).toBe('BAR!');
    expect(state.testDeleted).toBe(false);
  });

  it('should properly update', () => {
    testInstance.actionCreators.updateTest(
      { testFoo: 'FOO!!!', testBar: 'BAR!!!' },
      state => {
        expect(state.testId).toBe('123');
        expect(state.testFoo).toBe('FOO!!!');
        expect(state.testBar).toBe('BAR!!!');
        expect(state.testDeleted).toBe(false);
      }
    );

    const state = store.getState();
    expect(state.testId).toBe('123');
    expect(state.testFoo).toBe('FOO!!!');
    expect(state.testBar).toBe('BAR!!!');
    expect(state.testDeleted).toBe(false);
  });

  it('should properly delete', () => {
    testInstance.actionCreators.deleteTest(state => {
      expect(state.testId).toBe('123');
      expect(state.testFoo).toBe('FOO!!!');
      expect(state.testBar).toBe('BAR!!!');
      expect(state.testDeleted).toBe(true);
    });

    const state = store.getState();
    expect(state.testId).toBe('123');
    expect(state.testFoo).toBe('FOO!!!');
    expect(state.testBar).toBe('BAR!!!');
    expect(state.testDeleted).toBe(true);
  });

  it('should properly undelete', () => {
    testInstance.actionCreators.undeleteTest(state => {
      expect(state.testId).toBe('123');
      expect(state.testFoo).toBe('FOO!!!');
      expect(state.testBar).toBe('BAR!!!');
      expect(state.testDeleted).toBe(false);
    });

    const state = store.getState();
    expect(state.testId).toBe('123');
    expect(state.testFoo).toBe('FOO!!!');
    expect(state.testBar).toBe('BAR!!!');
    expect(state.testDeleted).toBe(false);
  });

  it('should properly set an individual state', () => {
    testInstance.actionCreators.setTestFoo('FOO!!!!!');

    const state = store.getState();
    expect(state.testId).toBe('123');
    expect(state.testFoo).toBe('FOO!!!!!');
    expect(state.testBar).toBe('BAR!!!');
    expect(state.testDeleted).toBe(false);
  });

  it('should have included default replication', () => {
    expect(test.replication.reducerKeys).toBe(true);
    expect(test.replication.queryable).toBe(true);
    expect(test.replication.baseQuery.testDeleted).toBe(false);
  });
});
