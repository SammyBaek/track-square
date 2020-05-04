import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createPromise} from 'redux-promise-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/rootReducer';

export default function configureStore() {
 return createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(createPromise(), thunkMiddleware))
 );
}
