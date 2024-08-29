// import { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../hooks/useAPI';

// interface AuthContextData {
//     signed: boolean;
//     token: string | null;
//     userId: number | null;
//     role: 'admin' | 'contador' | 'cliente' | null;
//     loading: boolean;
//     userAuth(login: string, senha: string): Promise<void>;
//     logout(): void;
// }

// const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// export const AuthProvider = ({ children }: { children: JSX.Element }) => {
//     const [token, setToken] = useState<string | null>(null);
//     const [userId, setUserId] = useState<number | null>(null);
//     const [role, setRole] = useState<'admin' | 'contador' | 'cliente' | null>(null); // Novo estado para o tipo de usuário
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storagedToken = localStorage.getItem('token');
//         const storagedUserId = localStorage.getItem('userId');
//         const storagedRole = localStorage.getItem('role'); // Recupera o tipo de usuário do localStorage

//         if (storagedToken && storagedUserId && storagedRole) {
//             setToken(storagedToken);
//             setUserId(Number(storagedUserId));
//             setRole(storagedRole as 'admin' | 'contador' | 'cliente'); // Define o tipo de usuário
//         }

//         setLoading(false);
//     }, []);

//     const userAuth = async (login: string, senha: string) => {
//         setLoading(true);
//         try {
//             const response = await api.post('/autentica/login', { login, senha });
//             const { token, id_usuario, role } = response.data; // Assume que a resposta contém o tipo de usuário
//             localStorage.setItem('token', token);
//             localStorage.setItem('userId', id_usuario);
//             localStorage.setItem('role', role); // Armazena o tipo de usuário no localStorage
//             setToken(token);
//             setUserId(id_usuario);
//             setRole(role); // Define o tipo de usuário no estado
//             navigate('/PaginaInicial');
//         } catch (error) {
//             console.error('Erro na autenticação:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
//         localStorage.removeItem('role'); // Remove o tipo de usuário do localStorage
//         setToken(null);
//         setUserId(null);
//         setRole(null); // Reseta o tipo de usuário
//         navigate('/Login');
//     };

//     return (
//         <AuthContext.Provider value={{ signed: !!token, token, userId, role, loading, userAuth, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth deve ser usado com AuthProvider');
//     }
//     return context;
// }


import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/useAPI';

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
        const storagedToken = localStorage.getItem('token');
        const storagedUserId = localStorage.getItem('userId');

        if (storagedToken && storagedUserId) {
            setToken(storagedToken);
            setUserId(Number(storagedUserId));
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