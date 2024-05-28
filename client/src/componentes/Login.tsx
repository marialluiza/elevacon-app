import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navegar = useNavigate();

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario(e.target.value);
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/autentica/login', {
        login: usuario,
        senha: senha
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      toast.success('Login realizado com sucesso!');
      // Redireciona para:
      navegar('/PaginaInicial');
    } catch (error) {
      setErro('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-blue-950 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-white">
              Digite seu nome de usuário
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={handleUsuarioChange}
              className="w-full px-3 py-2 mt-1 bg-slate-200 text-gray-900 placeholder-gray-500 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Digite seu usuario"
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
              onChange={handleSenhaChange}
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
}
