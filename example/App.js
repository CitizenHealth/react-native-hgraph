/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './src/reducers';
import ReduxThunk from 'redux-thunk';

import Home from './src/components/home';

type Props = {};
export default class App extends Component<Props> {
  render() {
    const store = createStore(reducers, {}, composeWithDevTools(
      applyMiddleware(ReduxThunk)));

    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}