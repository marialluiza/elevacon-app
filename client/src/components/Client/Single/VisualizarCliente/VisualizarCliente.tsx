import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../infra/context/AuthProvider";
import { Button } from "@radix-ui/themes";
import ModalAccess from "../ModalAccess";
import api from "../../../../infra/hooks/useAPI";
import NavBar from "../../../Header/Header";
import { IClient } from "../../../../interfaces/IClient";
import { toast } from "sonner";
import { formatDate } from "../../../../utils/formatDateUtils";


const VisualizarCliente = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [cancel, setCancel] = useState(false);
    const navigate = useNavigate();

    const { id } = useParams();
    const { token } = useAuth();
    const [clienteData, setClienteData] = useState<IClient>(Object);

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

    console.log("token::", token)

    const showClientAccess = async () => {
        try {
            const response = await api.post(
                `/cliente/gerar-acesso`,
                { login: clienteData.email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const loginInfo = response.data;
            
            if (loginInfo && loginInfo.senhaTemporaria) {
                setClienteData((prevData) => ({
                    ...prevData,
                    senhaGerada: loginInfo.senhaTemporaria,
                    usuario: { ...prevData.usuario, login: loginInfo.login }
                }));
            } else {
                console.error("A senha temporária não foi gerada corretamente.");
            }
    
            setOpen(true);
        } catch (error) {
            console.error("Erro ao gerar acesso:", error);
            toast.error("Erro ao gerar acesso:")
        }
    };
    

    const handleCancel = () => {
        setCancel(true);
        setOpen(false);
    };

    const handleEditarCliente = (id_cliente: string | undefined) => {
        navigate(`/EditarCliente/${id_cliente}`);
    };

    return (
        <>
            <NavBar />
            <div className="p-10 bg-white rounded-lg shadow-md">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold text-blue-950 mb-6 w-1/2">Informações do cliente</h2>
                    <div className="flex justify-between gap-10">
                        <Button
                            className=" hover:bg-blue-400 transition duration-300"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditarCliente(id)}>
                            Editar cliente
                        </Button>
                        <Button
                            className="hover:bg-blue-400 transition duration-300 "
                            style={{ cursor: "pointer" }}
                            onClick={showClientAccess}>Gerar acesso</Button>
                        {isOpen && (
                            <ModalAccess
                                clienteData={clienteData}
                                onClose={() => setOpen(false)}
                                onCancel={handleCancel}
                                isOpen={isOpen}
                            />
                        )}
                    </div>
                </div>
                <div className="mt-6 border-t">
                    <dl className="divide-y divide-gray-200">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Nome completo</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0"> {clienteData?.nome}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Email</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{clienteData?.email}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Telefone</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{clienteData?.telefone}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Data de Nascimento</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{formatDate(clienteData?.data_nascimento)}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Titulo de Eleitor</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                {clienteData?.titulo_eleitoral}
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Ocupação principal</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                {clienteData?.ocupacao_principal}
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">CPF</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                {clienteData?.cpf}
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Endereço</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                <div className="address-container space-y-1">
                                    <div className="address-line flex items-center">
                                        <span className="mr-2">📍</span> {clienteData?.logradouro}, {clienteData?.numero}
                                    </div>
                                    <div className="address-line flex items-center">
                                        <span className="mr-2">🏘️</span> {clienteData?.bairro}
                                    </div>
                                    <div className="address-line flex items-center">
                                        <span className="mr-2">🌆</span> {clienteData?.cidade} - {clienteData?.estado}
                                    </div>
                                    <div className="address-line flex items-center">
                                        <span className="mr-2">📮</span> CEP: {clienteData?.cep}
                                    </div>
                                </div>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Informações do Conjugue</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                {clienteData?.nome_conjugue}<br />
                                {clienteData?.cpf_conjugue}
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium text-gray-900">Observações</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                {clienteData?.observacao}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* <Link to="/ListaCliente" className=" right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700">
            Página anterior
          </Link> */}
            </div>
        </>
    )
}

export default VisualizarCliente;
