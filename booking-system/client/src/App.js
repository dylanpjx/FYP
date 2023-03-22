import React from 'react';

import AuthProvider from './AuthProvider';
import MyRoutes from './MyRoutes';


function App() {
  return (
    <AuthProvider>
      <MyRoutes />
    </AuthProvider>
  );
}

export default App;
