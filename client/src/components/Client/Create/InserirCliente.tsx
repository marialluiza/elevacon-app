import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../infra/context/AuthProvider';
import { isValidCPF } from '../../../utils/validateCpf';
import api from '../../../infra/hooks/useAPI';
import NavBar from '../../Header/Header';
import { toast } from 'sonner';


const InserirCliente = () => {


  const [clienteData, setClienteData] = useState({
    nome: '',
    data_nascimento: '',
    ocupacao_principal: '',
    email: '',
    titulo_eleitoral: '',
    cpf: '',
    telefone: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    nome_conjugue: '',
    cpf_conjugue: '',
    observacao: '',
  });

  const navigate = useNavigate();
  const { token, userId } = useAuth();
  const [cpfError, setCpfError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!isValidCPF(clienteData.cpf)) {
        setCpfError('CPF inválido.');
        return;
      }

      const response = await api.post('/cliente/cadastrar-cliente', {
        ...clienteData,
        id_usuario: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Cliente cadastrado com sucesso")
      navigate('/ListaCliente');
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setClienteData({ ...clienteData, [id]: value });
  };


  return (
    <>
      <NavBar />
      <form className="space-y-10 p-4 pl-8 pr-8 pb-6" onSubmit={handleSubmit}>
        <div className="border-b border-gray-900/10 pb-6">
          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-900">
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                onChange={handleChange}
                value={clienteData.nome}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500  placeholder:text-sm focus:ring-2 focus:outline-none focus:border-blue-300 "
                placeholder='nome completo...'
                required
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="data-nascimento" className="block text-sm font-medium text-gray-900">
                Data de nascimento
              </label>
              <input
                id="data_nascimento"
                type="date"
                value={clienteData.data_nascimento}
                onChange={handleChange}
                className="block w-full mt-2 p-2 rounded-md border border-slate-400 bg-white py-1.5 text-sm text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300"
              />
            </div>


            <div className="sm:col-span-2">
              <label htmlFor="ocupacao_principal" className="block text-sm font-medium text-gray-900">
                Ocupação principal
              </label>
              <input
                id="ocupacao_principal"
                type="text"
                value={clienteData.ocupacao_principal}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                placeholder="Informe a ocupação principal"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={clienteData.email}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                placeholder='exemplo@email.com'
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="titulo-eleitor" className="block text-sm font-medium text-gray-900">
                Título de eleitor
              </label>
              <input
                id="titulo_eleitoral"
                type="text"
                value={clienteData.titulo_eleitoral}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                placeholder="Informe o título de eleitor"
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
                className={`p-4 block w-full mt-2 rounded-md border ${cpfError ? 'border-red-500' : 'border-slate-400'} bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none ${cpfError ? 'focus:border-red-500' : 'focus:border-blue-300'}`}
                placeholder="Informe o CPF"
                required
              />
              {cpfError && <p className="text-red-500 text-sm mt-1">{cpfError}</p>}

            </div>

            <div className="sm:col-span-3">
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-900">
                Telefone
              </label>
              <input
                id="telefone"
                type="text"
                value={clienteData.telefone}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                placeholder='(xx)xxxxx-xxxx'
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="logradouro" className="block text-sm font-medium text-gray-900">
                Rua
              </label>
              <input
                id="logradouro"
                type="text"
                value={clienteData.logradouro}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="numero" className="block text-sm font-medium text-gray-900">
                Nº
              </label>
              <input
                id="numero"
                type="text"
                value={clienteData.numero}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bairro" className="block text-sm font-medium text-gray-900">
                Bairro
              </label>
              <input
                id="bairro"
                type="text"
                value={clienteData.bairro}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-900">
                Cidade
              </label>
              <input
                id="cidade"
                type="text"
                value={clienteData.cidade}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-900">
                Estado
              </label>
              <input
                id="estado"
                type="text"
                value={clienteData.estado}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cep" className="block text-sm font-medium text-gray-900">
                CEP
              </label>
              <input
                id="cep"
                type="text"
                value={clienteData.cep}
                onChange={handleChange}
                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
              />
            </div>
            <div className='grid sm:col-span-6 grid-cols-2 gap-x-6 gap-y-6'>
              <div>
                <label htmlFor="nome_conjugue" className="pb-2 block text-sm font-medium text-gray-900">
                  Informações do conjugue
                </label>

                <div className="flex border border-slate-400 rounded-md px-4" >
                  <div className="sm:col-span-2 p-4">
                    <label htmlFor="nome_conjugue" className="block text-sm font-medium text-gray-900">
                      Nome do cônjuge ou companheiro(a)
                    </label>
                    <input
                      id="nome_conjugue"
                      type="text"
                      value={clienteData.nome_conjugue}
                      onChange={handleChange}
                      className="p-4 w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 placeholder:text-sm focus:ring-2 focus:outline-none focus:border-blue-300 "
                      placeholder="Informe o nome do cônjuge"
                    />
                  </div>


                  <div className="sm:col-span-3 p-4">
                    <label htmlFor="cpf_conjugue" className="block text-sm font-medium text-gray-900">
                      CPF do Conjugue ou companheiro(a)
                    </label>
                    <input
                      id="cpf_conjugue"
                      type="text"
                      value={clienteData.cpf_conjugue}
                      onChange={handleChange}
                      className=" p-4 w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                      placeholder="Informe o CPF do cônjuge"
                    />
                  </div>
                </div>

              </div>

              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-900">
                  Observações
                </label>
                <textarea
                  id="observacao"
                  value={clienteData.observacao}
                  onChange={handleChange}
                  className="p-4 w-full h-4/5 mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder:text-sm placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300"
                  placeholder="Digite suas observações aqui"
                ></textarea>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-x-4">
          <Link to="/ListaCliente" className=" right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700">
            Cancelar
          </Link>
          <button
            type="submit"
            className=" right-4  px-4 py-2 bg-blue-500 text-white rounded-md ">
            Cadastrar Cliente
          </button>
        </div>
      </form>
    </>
  );
};

export default InserirCliente;