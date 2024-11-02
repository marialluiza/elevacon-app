import { useState, useEffect } from 'react';
import { Autocomplete, TextField, Button, CircularProgress } from '@mui/material';
import api from "../../../../hooks/useAPI";
import NavBar from "../../../ui/Header/Header";
import { useAuth } from "../../../../contexts/auth/AuthProvider";

interface Cliente {
    id_cliente: number;
    nome: string;
    id_usuario: number;
}

interface TipoDocumento {
    id: number;
    nome: string;
}

const EnviarDocumento: React.FC = () => {
    const { userId, token, loading } = useAuth();
    const [tipoDocumentos, setTipoDocumentos] = useState<TipoDocumento[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<TipoDocumento | null>(null);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Buscar tipos de documento
        const fetchTipoDocumentos = async () => {
            try {
                const response = await api.get('/tipo-documentos/listar', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTipoDocumentos(response.data);
            } catch (err) {
                console.error('Erro ao buscar tipos de documentos:', err);
            }
        };

        // Buscar clientes associados ao contador
        const fetchClientes = async () => {
            try {
                const response = await api.get('/cliente/listar-clientes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClientes(response.data);
            } catch (err) {
                console.error('Erro ao buscar clientes:', err);
            }
        };

        if (token) {
            fetchTipoDocumentos();
            fetchClientes();
        }
    }, [token]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!file || !selectedTipoDocumento || !selectedCliente) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tipoDocumentoId', selectedTipoDocumento.id.toString());
        formData.append('recebidoPorId', selectedCliente.id_usuario.toString()); // Envia o id_usuario do cliente

        setIsSubmitting(true);

        try {
            const response = await api.post('/documentos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data);
            setFile(null);
            setSelectedTipoDocumento(null);
            setSelectedCliente(null);
        } catch (err) {
            console.error('Erro ao enviar documento:', err);
            setError('Erro ao enviar o documento.');
        } finally {
            setIsSubmitting(false);
        }
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
                        <div className="mb-4">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                className="border border-gray-300 p-2 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <Autocomplete
                                options={tipoDocumentos}
                                getOptionLabel={(option) => option.nome}
                                value={selectedTipoDocumento}
                                onChange={(event, newValue) => setSelectedTipoDocumento(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tipo de Documento" variant="outlined" fullWidth />
                                )}
                            />
                        </div>
                        <div className="mb-4">
                            <Autocomplete
                                options={clientes}
                                getOptionLabel={(option) => option.nome}
                                value={selectedCliente}
                                onChange={(event, newValue) => setSelectedCliente(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Cliente" variant="outlined" fullWidth />
                                )}
                            />
                        </div>
                        {error && <p className="text-red-600">{error}</p>}
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
                </div>
            </div>
        </>
    );
};

export default EnviarDocumento;
