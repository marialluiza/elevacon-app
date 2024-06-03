import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/usaAPI';

interface AuthContextData {
    signed: boolean;
    token: string | null;
    userId: number | null;
    loading: boolean;
    userAuth(login: string, senha: string): Promise<void>;
    logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const storagedToken = await localStorage.getItem('token');
            if (storagedToken) {
                setToken(storagedToken);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    // useEffect(() => {
    //     const storagedToken = localStorage.getItem('token');
    //     if (storagedToken) {
    //         setToken(storagedToken);
    //     }
    //     setLoading(false);
    // }, []);

    const userAuth = async (login: string, senha: string) => {
        const response = await api.post('/autentica/login', { login, senha });
        const { token, id_usuario } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUserId(id_usuario);
        setLoading(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUserId(null);
        navigate('/Login');
    };

    return (
        <AuthContext.Provider value={{ signed: !!token, token, userId, loading, userAuth, logout }}>
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
