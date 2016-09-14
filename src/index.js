export default function provideMulti(props) {

  const { name, provider, actionTypes, initialState } = props;

  const properName = name[0].toUpperCase()+name.substring(1);
  const capitalName = name.toUpperCase();
  const INITIAL_STATE = [];

  const ADD = `ADD_${capitalName}`;
  const REMOVE = `REMOVE_${capitalName}`;
  const constants = {
    [ADD]: ADD,
    [REMOVE]: REMOVE,
  }

  const actions = {};
  const reducers = {};
  const reduceIndexed = (reducer, actionTypes) => {
    const reduced = (state = INITIAL_STATE, action) => {
      if (actionTypes[action.type]) {
        if (action.index >= 0 && action.index < state.length) {
          state = [
            ...state.slice(0, action.index),
            reducer(state[action.index], action),
            ...state.slice(action.index + 1)
          ];
        }
        return state;
      }
      switch (action.type) {
        case ADD:
          return [
            ...state,
            initialState
          ];
        case REMOVE:
          if (state.length == 0) {
            return state
          }
          return state.slice(0,state.length-1);
      }
      return state;
    }
    return reduced;
  }


  const bindIndexToDispatchedAction = (actionCreator, index) =>
    (dispatch, getState) => (...args) => {
      const action = Object.assign(actionCreator(...args), { index });
      dispatch(action);
    }

  for (const key of Object.keys(provider.actions)){
    actions[key] = (index) => bindIndexToDispatchedAction(provider.actions[key], index);
  };

  for (const key of Object.keys(provider.reducers)){
    reducers[`${key}Multi`] = reduceIndexed(provider.reducers[key], actionTypes);
  }

  const addActionKey = `add${properName}`;
  const removeActionKey = `remove${properName}`;
  actions[addActionKey] = () => ({ type: ADD });
  actions[removeActionKey] = () => ({ type: REMOVE });

  return {
    actions,
    reducers,
    constants,
  };

}
