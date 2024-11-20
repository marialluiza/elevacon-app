import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../infra/context/AuthProvider';
import { Eye, EyeOffIcon } from 'lucide-react';
import { Button, Spinner } from '@radix-ui/themes';

const Login: React.FC = () => {

  const { userAuth } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSenhaVisivel = () => {
    setSenhaVisivel(!senhaVisivel);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true); // Iniciar carregamento
    try {
      await userAuth(login, senha);
      navigate('/PaginaInicial');
    } catch (err) {
      console.error(err);
      setErro('Login falhou, verifique suas credenciais.');
    } finally {
      setIsLoading(false); // Encerrar carregamento
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
            {erro && <p className="mt-2 text-sm text-red-500">{erro}</p>}
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-white">
              Digite sua senha
            </label>
            <div className='relative'>
              <input
                id="senha"
                type={senhaVisivel ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-slate-200 text-gray-900 placeholder-gray-500 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={toggleSenhaVisivel}
                className="absolute right-4 top-3.5 text-sm text-gray-600"
              >
                {senhaVisivel ? <EyeOffIcon className=' text-gray-500 w-5' /> : <Eye className=' text-gray-500 w-5' />}
              </button>
            </div>
          </div>
          {erro && <p className="text-red-500">{erro}</p>}
          <div className="text-right">
            <a href="#" className="text-sm text-gray-400 hover:underline">
              Esqueceu sua senha?
            </a>
          </div>
          <button
            type="submit"
            className={`w-full h-12 flex items-center justify-center px-4 py-2 text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600 ${isLoading ? 'cursor-not-allowed opacity-75' : ''
              }`}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="3" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
