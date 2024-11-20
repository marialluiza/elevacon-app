import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/useAPI';
import { IClient } from '../../interfaces/IClient';
import { IContador } from '../../interfaces/IContador';

interface AuthContextData {
  signed: boolean;
  token: string | null;
  userId: number | null;
  userRole: string;
  client?: IClient;
  contador?: IContador;
  loading: boolean;
  userAuth(login: string, senha: string): Promise<void>;
  logout(): void;
  fetchClientData: (userId: number) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [client, setClient] = useState<IClient>();
  const [contador, setContador] = useState<IContador>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchClientData = async (userId: number) => {
    try {
      const response = await api.get(`/cliente/cliente-logado/${userId}`);
      const clientData = response.data;

      if (clientData.usuario.status === 'INATIVO') {
        alert('Seu acesso está inativo. Entre em contato com o contador.');
        logout();
        return;
      }

      setClient(clientData);
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error);
    }
  };


  // const fetchClientData = async (userId: number) => {
  //   try {
  //     const response = await api.get(`/cliente/cliente-logado/${userId}`);
  //     setClient(response.data);
  //   } catch (error) {
  //     console.error('Erro ao buscar dados do cliente:', error);
  //   }
  // };

  const fetchContadorData = async (userId: number) => {
    try {
      const response = await api.get(`/contador/contador-logado/${userId}`);
      setContador(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do contador:', error);
    }
  };

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
      } else if (decodedToken.role === 'CONTADOR') {
        fetchContadorData(Number(storagedUserId));
      }
    }

    setLoading(false);
  }, []);

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
      } else if (decodedToken.role === 'CONTADOR') {
        fetchContadorData(id_usuario);
      }

      navigate('/PaginaInicial');
    } catch (error) {
      console.error('Erro na autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    setUserRole('');
    setClient(undefined);
    setContador(undefined);
    navigate('/Login');
  };

  return (
    <AuthContext.Provider value={{ signed: !!token, token, client, contador, userId, userRole, loading, userAuth, logout, fetchClientData }}>
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
