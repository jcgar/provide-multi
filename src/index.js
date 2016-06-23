export default function provideCrud(
  name = 'resource', init = {}, replication = {}, clientStateKeys
) {
  const properName = name[0].toUpperCase()+name.substring(1);
  const capitalName = name.toUpperCase();

  const CREATE = `CREATE_${capitalName}`;
  const CREATED = `CREATED_${capitalName}`;
  const UPDATE = `UPDATE_${capitalName}`;
  const DELETE = `DELETE_${capitalName}`;
  const UNDELETE = `UNDELETE_${capitalName}`;

  const constants = {
    [CREATE]: CREATE,
    [CREATED]: CREATED,
    [UPDATE]: UPDATE,
    [DELETE]: DELETE,
    [UNDELETE]: UNDELETE
  };

  const idKey = `${name}Id`;
  const key = ({ props }) => props[idKey] ? `${idKey}=${props[idKey]}` : null;
  const actions = {};
  const reducers = {};

  const createActionKey = `create${properName}`;
  actions[createActionKey] = (state, genId, onSuccess) => {
    return (dispatch, getState, providerApi) => {
      state[idKey] = genId();

      providerApi.createInstance(state, crudInstance => {
        crudInstance.store.dispatch({ ...state, type: CREATE });

        if (onSuccess) {
          onSuccess(crudInstance.store.getState());
        }

        dispatch({ ...state, type: CREATED });
      });
    };
  };

  const updateActionKey = `update${properName}`;
  actions[updateActionKey] = (state, onSuccess) => {
    return (dispatch, getState) => {
      dispatch({ ...state, type: UPDATE });

      if (onSuccess) {
        onSuccess(getState());
      }
    };
  };

  const deleteActionKey = `delete${properName}`;
  actions[deleteActionKey] = (onSuccess) => {
    return (dispatch, getState) => {
      dispatch({ type: DELETE });

      if (onSuccess) {
        onSuccess(getState());
      }
    };
  };

  const undeleteActionKey = `undelete${properName}`;
  actions[undeleteActionKey] = (onSuccess) => {
    return (dispatch, getState) => {
      dispatch({ type: UNDELETE });

      if (onSuccess) {
        onSuccess(getState());
      }
    };
  };

  const deletedReducerKey = `${name}Deleted`;
  reducers[deletedReducerKey] = (state = false, action) => {
    switch (action.type) {
      case DELETE:
        return true;

      case UNDELETE:
        return false;

      default:
        return state;
    }
  };

  if (!init.id) {
    init.id = '';
  }

  for (let initKey in init) {
    let properKey = initKey[0].toUpperCase()+initKey.substring(1);
    let reducerKey = name+properKey;
    let properReducerKey = properName+properKey;
    let initialState = init[initKey];

    actions[`set${properReducerKey}`] = state => actions[updateActionKey]({
      [reducerKey]: state
    });

    reducers[reducerKey] = (state = initialState, action) => {
      switch (action.type) {
        case CREATE:
        case UPDATE:
          return typeof action[reducerKey] === 'undefined'
            ? state
            : action[reducerKey];

        default:
          return state;
      }
    };
  }

  if (typeof replication.reducerKeys === 'undefined') {
    replication.reducerKeys = true;
  }
  if (typeof replication.queryable === 'undefined') {
    replication.queryable = true;
  }
  if (typeof replication.baseQuery === 'undefined') {
    replication.baseQuery = {};
  }
  if (typeof replication.baseQuery[deletedReducerKey] === 'undefined') {
    replication.baseQuery[deletedReducerKey] = false;
  }

  return {
    ...constants, key, actions, reducers, replication, clientStateKeys
  };
}
