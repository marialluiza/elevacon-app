import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../infra/context/AuthProvider";
import api from "../../../../infra/hooks/useAPI";
import { useState } from "react";
import { IClient } from "../../../../interfaces/IClient";
import { toast } from "sonner";
import Utils from "../../../../utils/Utils";

interface EditarClienteClienteProps { }

const EditarClienteCliente: React.FC<EditarClienteClienteProps> = () => {
    const navigate = useNavigate();
    const { token, userId, client, fetchClientData } = useAuth();
    const [cliente, setCliente] = useState<IClient | undefined>(client);

    (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (!cliente?.id_cliente) {
                console.error('ID do cliente não encontrado');
                return;
            }

            const formattedData = {
                ...cliente,
                data_nascimento: cliente?.data_nascimento ? new Date(cliente?.data_nascimento).toISOString().split('T')[0] : '',
                id_usuario: userId,
            };

            if (!cliente.cpf || cliente.cpf.trim() === "") {
                toast.info("Insira o CPF.");
                return;
            }

            await api.put('/cliente/editar', formattedData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (userId) {
                await fetchClientData(userId);
            }
            navigate("/VisualizarClienteCliente")

        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target;

        // atualiza o estado do cliente apenas se `prev` estiver definido
        setCliente((prev) => {
            if (!prev) return prev; // retorna o estado anterior se estiver undefined
            return { ...prev, [id]: value };
        });

        if (id === "cep" && Utils.apenasNumeros(value).length === 8) {
            fetch(Utils.viaCep(value)) // URL da API
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erro ao buscar CEP");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.erro) {
                        alert("CEP não encontrado!");
                        return;
                    }

                    setCliente((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            logradouro: data.logradouro || "",
                            bairro: data.bairro || "",
                            cidade: data.localidade || "",
                            estado: data.uf || "",
                        };
                    });
                })
                .catch((error) => {
                    console.error("Erro ao buscar o CEP:", error);
                    toast.info("Erro ao buscar dados relacionados ao CEP. Tente novamente.");
                });
        }
    };


    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { id, value } = event.target;
    //     setCliente((prevData) => ({
    //         ...prevData,
    //         [id]: value,
    //     }) as IClient);

    // };

    return (
        <>
            <form className="space-y-10 p-4 pl-8 pr-8 pb-6" onSubmit={handleSubmit}>
                <div className="border-b border-gray-900/10 pb-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <div className="flex">
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-900">
                                    Nome Completo
                                </label>
                                <label className="text-red-600 ml-1">*</label>
                            </div>
                            <input
                                id="nome"
                                type="text"
                                onChange={handleChange}
                                // value={client?.nome}
                                value={cliente?.nome}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="nome completo..."
                            />
                        </div>

                        <div className="sm:col-span-1">
                            <div className="flex">
                                <label htmlFor="data-nascimento" className="block text-sm font-medium text-gray-900">
                                    Data de nascimento
                                </label>
                                <label className="text-red-600 ml-1">*</label>
                            </div>
                            <input
                                id="data_nascimento"
                                type="date"
                                value={cliente?.data_nascimento}
                                onChange={handleChange}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="ocupacao_principal" className="block text-sm font-medium text-gray-900">
                                Ocupação principal
                            </label>
                            <input
                                id="ocupacao_principal"
                                type="text"
                                value={cliente?.ocupacao_principal}
                                onChange={handleChange}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Informe a ocupação principal"
                            />
                        </div>

                        {/* <div className="sm:col-span-3">
                            <div className="flex">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <label className="text-red-600 ml-1">*</label>
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={cliente?.email}
                                onChange={handleChange}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder='exemplo@email.com'
                            />
                        </div> */}

                        <div className="sm:col-span-3">
                            <label htmlFor="titulo-eleitor" className="block text-sm font-medium text-gray-900">
                                Título de eleitor
                            </label>
                            <input
                                id="titulo_eleitoral"
                                type="text"
                                value={cliente?.titulo_eleitoral}
                                onChange={handleChange}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Informe o título de eleitor"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <div className="flex">
                                <label htmlFor="cpf" className="block text-sm font-medium text-gray-900">
                                    CPF
                                </label>
                                <label className="text-red-600 ml-1">*</label>
                            </div>
                            <input
                                id="cpf"
                                type="text"
                                value={cliente?.cpf}
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
                                value={cliente?.telefone}
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
                                value={cliente?.logradouro}
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
                                type="number"
                                onChange={handleChange}
                                value={cliente?.numero}
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
                                value={cliente?.bairro}
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
                                value={cliente?.cidade}
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
                                value={cliente?.estado}
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
                                value={cliente?.cep}
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
                                value={cliente?.nome_conjugue}
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
                                value={cliente?.cpf_conjugue}
                                onChange={handleChange}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Informe o CPF do cônjuge ou companheiro(a)"
                            />
                        </div>

                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full bg-blue-500 text-white rounded-md py-2"
                >
                    Salvar Alterações
                </button>
            </form>

        </>
    );
};

export default EditarClienteCliente;
