import React, { useCallback } from "react";
import { useAuth } from "../../../../infra/context/AuthProvider";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const VisualizarInformaçõesLadoCliente: React.FC = () => {
    const { client } = useAuth();
    const navigate = useNavigate();

    if (!client) {
        return <p>Carregando informações...</p>;
    }

    const handleEditar = useCallback(() => {
        navigate("/EditarClienteCliente");
    }, [navigate]);

    return (
        <div>

            <div className=" mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex px-4 sm:px-0 justify-between gap-10">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Informações pessoais</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Mantenha suas informações atualizadas para uso do seu contador.</p>
                    </div>

                    <div className="">
                        <Button
                            className=" hover:bg-blue-400 transition duration-300"
                            style={{ cursor: "pointer" }}
                            onClick={handleEditar}
                        >
                            Editar informações
                        </Button>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-200">
                        {/* Nome */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Nome</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client.nome}</dd>
                        </div>

                        {/* Email */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Email</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client?.usuario?.login}</dd>
                        </div>

                        {/* Telefone */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Telefone</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client.telefone}</dd>
                        </div>

                        {/* Título Eleitoral */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Título Eleitoral</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client.titulo_eleitoral}</dd>
                        </div>

                        {/* CPF */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">CPF</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client.cpf}</dd>
                        </div>

                        {/* Data de Nascimento */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Data de Nascimento</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client.data_nascimento}</dd>
                        </div>

                        {/* Ocupação */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Ocupação</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client.ocupacao_principal}</dd>
                        </div>

                        {/* Endereço */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Endereço</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                {client.logradouro}, {client.numero}, {client.bairro}, {client.cidade}, {client.estado}, {client.cep}
                            </dd>
                        </div>

                        {/* Nome do Cônjuge */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Nome do Cônjuge</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client.nome_conjugue}</dd>
                        </div>

                        {/* CPF do Cônjuge */}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">CPF do Cônjuge</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{client.cpf_conjugue}</dd>
                        </div>
                    </dl>
                </div>

            </div>
        </div>
    );
};

export default VisualizarInformaçõesLadoCliente;


{/* Se houver anexos, exibe-os aqui */ }
{/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Anexos</dt>
                            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm">
                                        <div className="flex w-0 flex-1 items-center">
                                            <PaperclipIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-gray-400" />
                                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                <span className="truncate font-medium">documento_cliente.pdf</span>
                                                <span className="shrink-0 text-gray-400">1.2mb</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 shrink-0">
                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                Baixar
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </dd>
                        </div> */}