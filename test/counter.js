export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const INITIAL_STATE = {
  value: 0,
  warning: false
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
    state = update(state, { warning: state.value > 5 });
    return state;
  }
}

export default {
  actions, reducers
};
