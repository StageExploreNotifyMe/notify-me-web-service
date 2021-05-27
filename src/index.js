import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.min.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import * as bulmaToast from 'bulma-toast'

bulmaToast.setDefaults({
    duration: 3000,
    position: 'top-right',
    dismissible: true,
    pauseOnHover: true
})

localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"})); //until auth is implemented

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
