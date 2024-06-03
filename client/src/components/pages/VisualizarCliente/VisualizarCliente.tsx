import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/ProvedorAutentica";
import api from "../../../hooks/usaAPI";
import NavBar from "../../ui/NavBar";


const VisualizarCliente = () => {
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

    return (
        <div className="p-10 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-950 mb-6">Informações do cliente</h2>
            <div className="mt-6 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Nome completo</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0"> {clienteData.nome}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Email</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{clienteData.email}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Telefone</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{clienteData.telefone}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Data de Nascimento</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{clienteData.data_nascimento}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Titulo de Eleitor</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                            {clienteData.titulo_eleitoral}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Ocupação principal</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                            {clienteData.ocupacao_principal}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">CPF</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                            {clienteData.cpf}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Endereço</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                            <div className="address-container space-y-1">
                                <div className="address-line flex items-center">
                                    <span className="mr-2">📍</span> {clienteData.logradouro}, {clienteData.numero}
                                </div>
                                <div className="address-line flex items-center">
                                    <span className="mr-2">🏘️</span> {clienteData.bairro}
                                </div>
                                <div className="address-line flex items-center">
                                    <span className="mr-2">🌆</span> {clienteData.cidade} - {clienteData.estado}
                                </div>
                                <div className="address-line flex items-center">
                                    <span className="mr-2">📮</span> CEP: {clienteData.cep}
                                </div>
                            </div>
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Informações do Conjugue</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                            {clienteData.nome_conjugue}<br />
                            {clienteData.cpf_conjugue}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-900">Observações</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                            {clienteData.observacao}
                        </dd>
                    </div>
                </dl>
            </div>

            <Link to="/ListaCliente" className=" right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 z-50">
            Página anterior
          </Link>
        </div>

    )
}

export default VisualizarCliente;
