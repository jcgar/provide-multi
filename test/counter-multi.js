import provideMulti from 'provide-multi';
import counter, { INCREMENT, DECREMENT, INITIAL_STATE } from './counter';

const counterMulti = provideMulti({
  name: 'counter',
  provider: counter,
  actionTypes: { INCREMENT, DECREMENT },
  initialState: INITIAL_STATE,
});

export default counterMulti;
