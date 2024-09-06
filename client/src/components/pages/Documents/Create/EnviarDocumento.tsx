import axios, { AxiosError } from "axios";

import { useState } from "react";
import { useAuth } from "../../../../contexts/auth/AuthProvider";
import api from "../../../../hooks/useAPI";
import NavBar from "../../../ui/Header/Header";
import { useNavigate } from "react-router-dom";

const EnviarDocumento: React.FC = () => {
    const { token } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [tipoDocumentoId, setTipoDocumentoId] = useState<number | null>(null);
    const [recebidoPorId, setRecebidoPorId] = useState<number | null>(null);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !tipoDocumentoId || !recebidoPorId) {
            setMensagem("Todos os campos são obrigatórios!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("tipoDocumentoId", tipoDocumentoId.toString());
        formData.append("recebidoPorId", recebidoPorId.toString());

        try {
            const response = await api.post(`/documentos/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            setMensagem(response.data);
            setFile(null);
            setTipoDocumentoId(null);
            setRecebidoPorId(null);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setMensagem(`Erro ao enviar documento: ${error.message}`);
            } else {
                setMensagem('Erro desconhecido ao enviar documento.');
            }
        }
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Enviar Documento</h2>
                    {mensagem && <p className="text-red-600 mb-4">{mensagem}</p>}
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="file">Arquivo</label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="tipoDocumentoId">Tipo de Documento ID</label>
                            <input
                                type="number"
                                id="tipoDocumentoId"
                                name="tipoDocumentoId"
                                value={tipoDocumentoId || ""}
                                onChange={(e) => setTipoDocumentoId(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="recebidoPorId">Recebido Por ID</label>
                            <input
                                type="number"
                                id="recebidoPorId"
                                name="recebidoPorId"
                                value={recebidoPorId || ""}
                                onChange={(e) => setRecebidoPorId(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="py-2 px-4 w-full text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                            Enviar Documento
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EnviarDocumento;
