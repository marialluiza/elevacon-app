import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/usaAPI';

interface AuthContextData {
    signed: boolean;
    token: string | null;
    userAuth(login: string, senha: string): Promise<void>;
    logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storagedToken = localStorage.getItem('token');
        if (storagedToken) {
            setToken(storagedToken);
            navigate('/PaginaInicial');
        }
    }, []);

    const userAuth = async (login: string, senha: string) => {
        const response = await api.post('/autentica/login', { login, senha });
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/Login');
    };

    return (
        <AuthContext.Provider value={{ signed: !!token, token, userAuth, logout }}>
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