import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './css/tailwind.css'

import Store from './store'
import { Provider } from 'react-redux'
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: '/api/',
});

const Wrapper = function () {
  return (
    <Provider store={Store}>
     <ApolloProvider client={client}>
     <App />
     </ApolloProvider>
    
    </Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Wrapper />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
