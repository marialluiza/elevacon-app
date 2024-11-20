import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../infra/context/AuthProvider';
import api from '../../infra/hooks/useAPI';
import { toast } from 'sonner';
import { Eye, EyeOffIcon } from 'lucide-react';
import { Button } from '@radix-ui/themes';

export const EditarPerfil = () => {
    const navigate = useNavigate();
    const { token, userId } = useAuth();
    const [perfilData, setPerfilData] = useState<IDadosAcesso>({ idUsuario: userId });
    const [senhaAntiga, setSenhaAntiga] = useState<string>('');
    const [senhaVisivel, setSenhaVisivel] = useState<boolean>(false);

    const toggleSenhaVisivel = () => {
        setSenhaVisivel(!senhaVisivel);
    };

    useEffect(() => {
        const fetchPerfilData = async () => {
            try {
                const response = await api.get(`/usuario/usuario-byId/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPerfilData({ idUsuario: userId, login: response.data.login });
            } catch (error) {
                console.error('Erro ao buscar dados do perfil:', error);
                toast.error('Erro ao buscar dados do perfil');
            }
        };
        fetchPerfilData();
    }, [userId, token]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!senhaAntiga || !perfilData?.senha) {
            toast.error('Por favor, preencha a senha antiga e a nova senha.');
            return;
        }

        const atualizacaoDTO = {
            login: perfilData.login,
            senha: perfilData.senha,
        };

        try {
            await api.put(`/usuario/atualizar`, {
                ...atualizacaoDTO,
                idUsuario: perfilData.idUsuario
            }, {
                params: { senhaAntiga },
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Perfil atualizado com sucesso');
            navigate('/PaginaInicial');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            toast.error('Senha atual incorreta.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPerfilData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    return (
        <>
            <form className="space-y-10 p-4 pl-8 pr-8 pb-6" onSubmit={handleSubmit}>
                <div className="border-b border-gray-900/10 pb-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-6"> {/* Isso faz o campo de email ocupar toda a linha */}
                            <label htmlFor="login" className="block text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <input
                                autoComplete="off"
                                id="login"
                                type="email"
                                onChange={handleChange}
                                value={perfilData.login || ''}
                                className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300"
                                placeholder="Email"
                            />
                        </div>

                        <div className="sm:col-span-3"> {/* Coluna 1 para Senha Antiga */}
                            <label htmlFor="senhaAntiga" className="block text-sm font-medium text-gray-900">
                                Senha Atual
                            </label>
                            <div className="relative">
                                <input
                                    type={senhaVisivel ? 'text' : 'password'}
                                    id="senhaAntiga"
                                    onChange={(e) => setSenhaAntiga(e.target.value)}
                                    value={senhaAntiga}
                                    className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300"
                                    placeholder="Senha Antiga"
                                />
                                <button
                                    type="button"
                                    onClick={toggleSenhaVisivel}
                                    className="absolute right-4 top-2 text-sm text-gray-600"
                                >
                                    {senhaVisivel ? <EyeOffIcon className=' text-gray-500 w-5' /> : <Eye className=' text-gray-500 w-5' />}
                                </button>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-900">
                                Nova Senha
                            </label>
                            <div className='relative'>
                                <input
                                    type={senhaVisivel ? 'text' : 'password'}
                                    id="senha"
                                    onChange={handleChange}
                                    value={perfilData.senha || ''}
                                    className="p-4 block w-full mt-2 rounded-md border border-slate-400 bg-white py-1.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none focus:border-blue-300"
                                    placeholder="Nova Senha"
                                />
                                <button
                                    type="button"
                                    onClick={toggleSenhaVisivel}
                                    className="absolute right-4 top-2 text-sm text-gray-600"
                                >
                                    {senhaVisivel ? <EyeOffIcon className=' text-gray-500 w-5' /> : <Eye className=' text-gray-500 w-5' />}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="mt-6 w-full rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none"
                >
                    Atualizar Perfil
                </Button>
            </form>

        </>
    );
};
