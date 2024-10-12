import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../infra/context/AuthProvider';

const Login: React.FC = () => {

  const { userAuth } = useAuth(); 
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAuth(login, senha); 
      navigate('/PaginaInicial'); 
    } catch (err) {
      setErro('Login falhou, verifique suas credenciais.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-blue-950 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-white">
              Digite seu nome de usuário
            </label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-slate-200 text-gray-900 placeholder-gray-500 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Digite seu login"
              required
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-white">
              Digite sua senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-slate-200 text-gray-900 placeholder-gray-500 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Digite sua senha"
              required
            />
          </div>
          {erro && <p className="text-red-500">{erro}</p>}
          <div className="text-right">
            <a href="#" className="text-sm text-gray-400 hover:underline">
              Esqueceu sua senha?
            </a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600"
          >
            LOGAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;