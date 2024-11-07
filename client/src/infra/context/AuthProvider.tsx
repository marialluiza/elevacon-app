import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/useAPI';
import { IClient } from '../../interfaces/IClient';

interface AuthContextData {
  signed: boolean;
  token: string | null;
  userId: number | null;
  userRole: string;
  client?: IClient;
  loading: boolean;
  userAuth(login: string, senha: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [client, setClient] = useState<IClient>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar dados do cliente
  const fetchClientData = async (userId: number) => {
    try {
      const response = await api.get(`/cliente/cliente-logado/${userId}`);
      setClient(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error);
    }
  };

  // Efeito para verificar e configurar token e userId ao carregar a aplicação
  useEffect(() => {
    const storagedToken = localStorage.getItem('token');
    const storagedUserId = localStorage.getItem('userId');

    if (storagedToken && storagedUserId) {
      setToken(storagedToken);
      setUserId(Number(storagedUserId));
      const decodedToken: any = jwtDecode(storagedToken);
      setUserRole(decodedToken.role);

      if (decodedToken.role === 'CLIENTE') {
        fetchClientData(Number(storagedUserId));
      }
    }

    setLoading(false);
  }, []);

  // Função para autenticar o usuário
  const userAuth = async (login: string, senha: string) => {
    setLoading(true);
    try {
      const response = await api.post('/autentica/login', { login, senha });
      const { token, id_usuario } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id_usuario);
      setToken(token);
      setUserId(id_usuario);

      const decodedToken: any = jwtDecode(token);
      setUserRole(decodedToken.role);

      if (decodedToken.role === 'CLIENTE') {
        fetchClientData(id_usuario);
      }

      navigate('/PaginaInicial');
    } catch (error) {
      console.error('Erro na autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    setUserRole('');
    setClient(undefined);
    navigate('/Login');
  };

  return (
    <AuthContext.Provider value={{ signed: !!token, token, client, userId, userRole, loading, userAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado com AuthProvider');
  }
  return context;
}

// import { jwtDecode } from 'jwt-decode';
// import { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../hooks/useAPI';
// import { IClient } from '../../interfaces/IClient';

// interface AuthContextData {
//   signed: boolean;
//   token: string | null;
//   userId: number | null;
//   userRole: string;
//   client?: IClient;
//   loading: boolean;
//   userAuth(login: string, senha: string): Promise<void>;
//   logout(): void;
// }

// const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// export const AuthProvider = ({ children }: { children: JSX.Element }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [userId, setUserId] = useState<number | null>(null);
//   const [userRole, setUserRole] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [client, setClient] = useState<IClient>();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storagedToken = localStorage.getItem('token');
//     const storagedUserId = localStorage.getItem('userId');

//     if (storagedToken && storagedUserId) {
//       setToken(storagedToken);
//       setUserId(Number(storagedUserId));
//       const decodedToken: any = jwtDecode(storagedToken);
//       setUserRole(decodedToken.role);

//     }

//     setLoading(false);
//   }, []);

//   console.log("userIDD:::", userId)

//   const fetchClientData = async (userId: number) => {
//     try {
//       const response = await api.get(`/cliente/cliente-logado/${userId}`);
//       const clientData = response.data;
//       setClient(clientData)
//       return clientData;
//     } catch (error) {
//       console.error('Erro ao buscar dados do cliente:', error);
//       return null;
//     }
//   };

//   // const userAuth = async (login: string, senha: string) => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await api.post('/autentica/login', { login, senha });
//   //     const { token, id_usuario } = response.data;
//   //     localStorage.setItem('token', token);
//   //     localStorage.setItem('userId', id_usuario);
//   //     setToken(token);
//   //     setUserId(id_usuario);
//   //     const decodedToken: any = jwtDecode(token);
//   //     setUserRole(decodedToken.role);
//   //     navigate('/PaginaInicial');

//   //     console.log('Conteúdo do token:', decodedToken);

//   //   } catch (error) {
//   //     console.error('Erro na autenticação:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const userAuth = async (login: string, senha: string) => {
//     setLoading(true);
//     try {
//       const response = await api.post('/autentica/login', { login, senha });
//       const { token, id_usuario } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('userId', id_usuario);
//       setToken(token);
//       setUserId(id_usuario);
//       const decodedToken: any = jwtDecode(token);
//       setUserRole(decodedToken.role);

//       if (decodedToken.role === 'CLIENTE') {
//         const clientData = await fetchClientData(id_usuario);
//         console.log("CLIENTE NO USERAUTH:", clientData)
//         if (clientData) {
//           setClient(clientData);         }
//       }

//       navigate('/PaginaInicial');
//     } catch (error) {
//       console.error('Erro na autenticação:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const storagedToken = localStorage.getItem('token');
//     const storagedUserId = localStorage.getItem('userId');

//     if (storagedToken && storagedUserId) {
//       setToken(storagedToken);
//       setUserId(Number(storagedUserId));

//       try {
//         const decodedToken: any = jwtDecode(storagedToken);
//         setUserRole(decodedToken.role);
//       } catch (error) {
//         console.error('Erro ao decodificar token:', error);
//       }
//     }

//     setLoading(false);
//   }, []);


//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     setToken(null);
//     setUserId(null);
//     setUserRole('');
//     navigate('/Login');
//   };

//   return (
//     <AuthContext.Provider value={{ signed: !!token, token, client, userId, userRole, loading, userAuth, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth deve ser usado com AuthProvider');
//   }
//   return context;
// }