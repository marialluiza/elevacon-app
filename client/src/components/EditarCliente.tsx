import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/auth/ProvedorAutentica";
import { useEffect, useState } from "react";
import api from "../hooks/usaAPI";
import NavBar from "./ui/Header/Header";

const EditarCliente = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { token, userId } = useAuth();

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

    useEffect(() => {
        const fetchClienteData = async () => {
            try {
                const response = await api.get(`/cliente/buscar-cliente/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClienteData(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados do cliente:', error);
            }
        };

        fetchClienteData();
    }, [id, token]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await api.put(`/cliente/editar-cliente/${id}`, {
                ...clienteData,
                id_usuario: userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Cliente atualizado com sucesso:', response.data);
            navigate('/ListaCliente');
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setClienteData({ ...clienteData, [id]: value });
    };

    return (
        <>
            <NavBar />
            <form className="space-y-10 p-4 pl-8 pr-8 pb-6" onSubmit={handleSubmit}>
                <div className="border-b border-gray-900/10 pb-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-900">
                                Nome Completo
                            </label>
                            <input
                                id="nome"
                                type="text"
                                onChange={handleChange}
                                value={clienteData.nome}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="nome completo..."
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
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
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
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
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
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder='exemplo@email.com'
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
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
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
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Informe o CPF"
                            />
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
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder='(xx)xxxxx-xxxx'
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="logradouro" className="block text-sm font-medium text-gray-900">
                                Logradouro
                            </label>
                            <input
                                id="logradouro"
                                type="text"
                                value={clienteData.logradouro}
                                onChange={handleChange}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                            />
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="numero" className="block text-sm font-medium text-gray-900">
                                Nº
                            </label>
                            <input
                                id="numero"
                                type="text"
                                onChange={handleChange}
                                value={clienteData.numero}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="bairro" className="block text-sm font-medium text-gray-900">
                                Bairro
                            </label>
                            <input
                                id="bairro"
                                type="text"
                                onChange={handleChange}
                                value={clienteData.bairro}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
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
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                            />
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="estado" className="block text-sm font-medium text-gray-900">
                                Estado
                            </label>
                            <input
                                id="estado"
                                type="text"
                                onChange={handleChange}
                                value={clienteData.estado}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                            />
                        </div>

                        <div className="sm:col-span-2 pb-10">
                            <label htmlFor="cep" className="block text-sm font-medium text-gray-900">
                                CEP
                            </label>
                            <input
                                id="cep"
                                type="text"
                                onChange={handleChange}
                                value={clienteData.cep}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                            />
                        </div>

                    </div>

                    <label htmlFor="nome_conjugue" className="block text-sm font-medium text-gray-900">
                        Informações do conjugue
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-6  border border-slate-400 rounded-md px-4">
                        <div className="sm:col-span-3 p-4">
                            <label htmlFor="nome_conjugue" className="block text-sm font-medium text-gray-900">
                                Nome do cônjuge ou companheiro(a)
                            </label>
                            <input
                                id="nome_conjugue"
                                type="text"
                                value={clienteData.nome_conjugue}
                                onChange={handleChange}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Informe o nome do cônjuge ou companheiro(a)"
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
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Informe o CPF do cônjuge ou companheiro(a)"
                            />
                        </div>

                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-6 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                    Atualizar Cliente
                </button>
            </form>

        </>
    )
}

export default EditarCliente;
