import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/useAPI';

interface AuthContextData {
  signed: boolean;
  token: string | null;
  userId: number | null;
  userRole: string;
  loading: boolean;
  userAuth(login: string, senha: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storagedToken = localStorage.getItem('token');
    const storagedUserId = localStorage.getItem('userId');

    if (storagedToken && storagedUserId) {
      setToken(storagedToken);
      setUserId(Number(storagedUserId));
      const decodedToken: any = jwtDecode(storagedToken);
      setUserRole(decodedToken.role);

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
      navigate('/PaginaInicial');

      console.log('Conteúdo do token:', decodedToken);

    } catch (error) {
      console.error('Erro na autenticação:', error);
    } finally {
      setLoading(false);
    } 
  };

  const fetchContadorId = async (userId: number) => {
    try {
      const response = await api.get(`/clientes/${userId}/contador`);
      const { contadorId } = response.data;
      console.log('ID do contador:', contadorId);
      return contadorId;
    } catch (error) {
      console.error('Erro ao buscar contadorId:', error);
      return null;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchContadorId(userId).then((contadorId) => {
        if (contadorId) {
          console.log('Contador encontrado:', contadorId);
        }
      });
    }
  }, [userId]);



  useEffect(() => {
    const storagedToken = localStorage.getItem('token');
    const storagedUserId = localStorage.getItem('userId');

    if (storagedToken && storagedUserId) {
      setToken(storagedToken);
      setUserId(Number(storagedUserId));

      try {
        const decodedToken: any = jwtDecode(storagedToken);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }

    setLoading(false);
  }, []);


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    setUserRole('');
    navigate('/Login');
  };

  return (
    <AuthContext.Provider value={{ signed: !!token, token, userId, userRole, loading, userAuth, logout }}>
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