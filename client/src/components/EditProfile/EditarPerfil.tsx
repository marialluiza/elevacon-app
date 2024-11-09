import { useNavigate } from "react-router-dom";
import { useAuth } from "../../infra/context/AuthProvider";
import { useEffect, useState } from "react";
import api from "../../infra/hooks/useAPI";
import { toast } from "sonner";
import NavBar from "../Header/Header";

export const EditarPerfil = () => {

    const navigate = useNavigate();
    const { token, userId } = useAuth();

    const [perfilData, setPerfilData] = useState({
        nome: '',
        email: '',
        telefone: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
    });

    useEffect(() => {
        const fetchPerfilData = async () => {
            try {
                const response = await api.get(`/usuario/usuario-byId/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPerfilData(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados do perfil:', error);
                toast.error('Erro ao buscar dados do perfil');
            }
        };

        fetchPerfilData();
    }, [userId, token]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await api.put(`/usuario/atualiza/${userId}`, perfilData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Perfil atualizado com sucesso');
            navigate('/perfil');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            toast.error('Erro ao atualizar perfil');
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setPerfilData(prevData => ({ ...prevData, [id]: value }));
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
                                value={perfilData.nome}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Nome completo..."
                            />
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                onChange={handleChange}
                                value={perfilData.email}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Email"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-900">
                                Telefone
                            </label>
                            <input
                                id="telefone"
                                type="text"
                                onChange={handleChange}
                                value={perfilData.telefone}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Telefone"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="logradouro" className="block text-sm font-medium text-gray-900">
                                Logradouro
                            </label>
                            <input
                                id="logradouro"
                                type="text"
                                onChange={handleChange}
                                value={perfilData.logradouro}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300 "
                                placeholder="Logradouro"
                            />
                        </div>

                        {/* Adicione os campos restantes (numero, bairro, cidade, estado, cep) seguindo a mesma estrutura */}
                        
                    </div>
                    <button type="submit" className="mt-6 inline-flex justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none">
                        Salvar
                    </button>
                </div>
            </form>
        </>
    );
}

export default EditarPerfil;