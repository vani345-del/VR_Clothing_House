import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'sonner';


import AppRoutes from './AppRoutes'; // Move all routes and Redux logic here

const App = () => {
  return (
    <Provider store={store}>
     
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
