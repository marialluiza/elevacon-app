import { useState, useEffect } from 'react';
import { Autocomplete, TextField, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { useAuth } from "../../../infra/context/AuthProvider";
import api from '../../../infra/hooks/useAPI';
import NavBar from '../../Header/Header';
import { toast } from 'sonner';
import CreateDocumentNewType from '../CreateType';
import { IClient } from '../../../interfaces/IClient';
import { Trash2 } from 'lucide-react';

interface TipoDocumento {
    id: number;
    nome: string;
}

const EnviarDocumento: React.FC = () => {
    const { token, loading, userRole, client, contador } = useAuth();
    const [tipoDocumentos, setTipoDocumentos] = useState<TipoDocumento[]>([]);
    const [usuarios, setUsuarios] = useState<IClient[]>([]);
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<TipoDocumento | null>(null);
    const [selectedUsuario, setSelectedUsuario] = useState<IClient | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setOpen] = useState<boolean>(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
    const idContador = contador?.id_contador || client?.id_contador;

    useEffect(() => {
        const fetchTipoDocumentos = async () => {
            try {
                const response = await api.get(`/tipo-documentos/listar?id_contador=${idContador}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTipoDocumentos(response.data);
            } catch (err) {
                console.error('Erro ao buscar tipos de documentos:', err);
            }
        };

        if (userRole == "CONTADOR") {

            const fetchUsuarios = async () => {
                try {
                    const response = await api.get('/cliente/listar-clientes', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUsuarios(response.data);
                } catch (err) {
                    console.error('Erro ao buscar usuários:', err);
                }
            };

            if (token) {
                fetchUsuarios();
            }
        }

        if (token) {
            fetchTipoDocumentos();
        }
    }, [token, userRole, idContador]);

    const handleDeleteTipoDocumento = async () => {
        if (!selectedTipoDocumento) return;

        try {
            await api.delete(`/tipo-documentos/${selectedTipoDocumento.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Tipo de documento excluído com sucesso.');
            setTipoDocumentos((prev) => prev.filter((doc) => doc.id !== selectedTipoDocumento.id));
            setSelectedTipoDocumento(null);
            setConfirmDeleteOpen(false);
        } catch (err) {
            console.error('Erro ao excluir tipo de documento:', err);
            toast.error('Erro ao excluir tipo de documento.');
        }
    };
    
    const handleDelete = (tipoDocumento: TipoDocumento) => {
        setSelectedTipoDocumento(tipoDocumento);
        setConfirmDeleteOpen(true);
    };

    if (loading || (userRole === "CLIENTE" && !client)) {
        return <div>Carregando...</div>;
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!file || !selectedTipoDocumento) {
            setError('Todos os campos são obrigatórios.');
            toast.info('Todos os campos são obrigatórios.');
            return;
        }

        const recebidoPorId = userRole === "CLIENTE" ? client?.contador?.usuario?.idUsuario : selectedUsuario?.usuario.idUsuario;

        if (userRole === "CONTADOR" && !selectedUsuario) {
            setError('Por favor, selecione um cliente.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tipoDocumentoId', selectedTipoDocumento.id.toString());
        formData.append('recebidoPorId', recebidoPorId!.toString());

        setIsSubmitting(true);

        try {
            const response = await api.post('/documentos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Documento enviado com sucesso.', response.data);
            setFile(null);
            setSelectedTipoDocumento(null);
            setSelectedUsuario(null);
        } catch (err) {
            console.error('Erro ao enviar documento:', err);
            setError('Erro ao enviar o documento.');
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleCreateTipoDocumento = (novoTipoDocumento: TipoDocumento) => {
        setTipoDocumentos((prevTipos) => [...prevTipos, novoTipoDocumento]);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Enviar Documento</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex justify-between">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                className="border border-gray-300 p-2 rounded-md"
                            />
                            {userRole === "CONTADOR" && (
                                <>
                                    <button
                                        onClick={() => { setOpen(true) }}
                                        type="button"
                                        className="right-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                                        Criar novo tipo
                                    </button>
                                    <CreateDocumentNewType isOpen={isOpen} onClose={() => setOpen(false)} onCreate={handleCreateTipoDocumento} />
                                </>
                            )}
                        </div>
                        <div className="mb-4">
                            <Autocomplete
                                options={tipoDocumentos}
                                getOptionLabel={(option) => option.nome}
                                value={selectedTipoDocumento}
                                onChange={(_, newValue) => setSelectedTipoDocumento(newValue)}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id} className="flex justify-center">
                                        <div className='w-[95%]'>
                                            {option.nome}
                                        </div>
                                        <div className="flex justify-end">
                                            {
                                                userRole === "CONTADOR" && (
                                                    <IconButton
                                                        edge="end"
                                                        color="secondary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(option);
                                                        }}
                                                        className="flex justify-end"
                                                    >
                                                        <Trash2 width={15} color="red" />
                                                    </IconButton>
                                                )
                                            }
                                        </div>
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tipo de Documento" variant="outlined" fullWidth />
                                )}
                            />
                            <Dialog
                                open={confirmDeleteOpen}
                                onClose={() => setConfirmDeleteOpen(false)}
                            >
                                <DialogTitle>Confirmar Exclusão</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Tem certeza de que deseja excluir o tipo de documento "{selectedTipoDocumento?.nome}"?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleDeleteTipoDocumento} color='error' autoFocus>
                                        Excluir
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        {userRole === "CONTADOR" && (
                            <>
                                <div className="mb-4">
                                    <Autocomplete
                                        options={usuarios}
                                        getOptionLabel={(option) => option.nome}
                                        value={selectedUsuario}
                                        onChange={(_, newValue) => setSelectedUsuario(newValue)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Enviar para" variant="outlined" fullWidth />
                                        )}
                                    />
                                </div>
                                {error && <p className="text-red-600">{error}</p>}
                            </>
                        )}

                        <div className="mt-4">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                fullWidth
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : 'Enviar Documento'}
                            </Button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    );
};

export default EnviarDocumento;
