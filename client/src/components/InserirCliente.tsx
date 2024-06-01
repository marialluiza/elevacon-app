import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/usaAPI'; // Verifique o caminho correto do seu arquivo api
import { useAuth } from '../contexts/auth/ProvedorAutentica';

const InserirCliente = () => {
  const [clienteData, setClienteData] = useState({
    dataNascimento: '',
    ocupacao: '',
    cpf: '',
    tituloEleitor: '',
    conjugeNome: '',
    conjugeCpf: ''
  });

  const navigate = useNavigate();

  const { token, userId } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Token utilizado:', token);
    try {
        const response = await api.post('/cliente/cadastrar-cliente', {
            ...clienteData,
            id_usuario: userId // Envie o ID do usuário junto com os dados do cliente
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Cliente cadastrado com sucesso:', response.data);
        // Adicione lógica adicional após o sucesso, como exibição de mensagem ou navegação
        navigate('/ListaCliente');
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        // Trate o erro adequadamente, exibindo mensagem ou realizando outra ação
    }
};

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setClienteData({ ...clienteData, [id]: value });
  };

  return (
    <form className="space-y-12 p-8" onSubmit={handleSubmit}>
      <div className="border-b border-gray-900/10 pb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

          <div className="sm:col-span-3">
            <label htmlFor="data-nascimento" className="block text-sm font-medium text-gray-900">
              Data de nascimento
            </label>
            <input
              id="dataNascimento"
              type="date"
              value={clienteData.dataNascimento}
              onChange={handleChange}
              className="block w-full mt-2 rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="ocupacao" className="block text-sm font-medium text-gray-900">
              Ocupação principal
            </label>
            <input
              id="ocupacao"
              type="text"
              value={clienteData.ocupacao}
              onChange={handleChange}
              className="block w-full mt-2 rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600"
              placeholder="Informe a ocupação principal"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-900">
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              value={clienteData.cpf}
              onChange={handleChange}
              className="block w-full mt-2 rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600"
              placeholder="Informe o CPF"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="titulo-eleitor" className="block text-sm font-medium text-gray-900">
              Título de eleitor
            </label>
            <input
              id="tituloEleitor"
              type="text"
              value={clienteData.tituloEleitor}
              onChange={handleChange}
              className="block w-full mt-2 rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600"
              placeholder="Informe o título de eleitor"
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="conjuge-nome" className="block text-sm font-medium text-gray-900">
              Nome do cônjuge ou companheiro(a)
            </label>
            <input
              id="conjugeNome"
              type="text"
              value={clienteData.conjugeNome}
              onChange={handleChange}
              className="block w-full mt-2 rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600"
              placeholder="Informe o nome do cônjuge ou companheiro(a)"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="conjuge-cpf" className="block text-sm font-medium text-gray-900">
              CPF do Conjugue ou companheiro(a)
            </label>
            <input
              id="conjugeCpf"
              type="text"
              value={clienteData.conjugeCpf}
              onChange={handleChange}
              className="block w-full mt-2 rounded-md border-0 bg-gray-200 py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600"
              placeholder="Informe o CPF do cônjuge ou companheiro(a)"
            />
          </div>

        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="submit" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Cadastrar cliente
        </button>
        {/* Outros botões e links omitidos para brevidade */}
      </div>
    </form>
  );
};

export default InserirCliente;
