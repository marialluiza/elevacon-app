// import { Link, Route, Routes } from 'react-router-dom';
// import { Login } from './components/Login';

// import { RequerAutentica } from './components/RequerAutentica';
// import { PaginaInicial } from './components/PaginaInicial';

// function App() {

//   return (
//     <div className="App">
//       <header>
//         <nav>
//           <Link to="/Login"> Login</Link>
//           <Link to="/PaginaInicial"> Pagina Inicial</Link>
//         </nav>
//       </header>
//       <hr />
//       <Routes>
//         <Route path="/Login" element={<Login />} />
//         <Route path="/PaginaInicial" element={<RequerAutentica><PaginaInicial/></RequerAutentica>} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/auth/ProvedorAutentica';
import { PaginaInicial } from './components/PaginaInicial';
import Login from './components/Login';
// import ListaCliente from './components/ListaCliente';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/PaginaInicial" element={<PaginaInicial />} />
            {/* <Route path="/ListaCliente" element={<ListaCliente />} /> */}
          </Route>
          <Route path="/" element={<Navigate to="/Login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
