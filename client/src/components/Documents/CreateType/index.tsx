import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../infra/context/AuthProvider";
import api from "../../../infra/hooks/useAPI";
import { ITipoDocumento } from "../../../interfaces/ITipoDocumento";

interface CreateDocumentNewTypeProps {
    onClose: () => void;
    isOpen: boolean;
    onCreate: (tipoDocumento: any) => void;
}

const CreateDocumentNewType: React.FC<CreateDocumentNewTypeProps> = ({ onClose, isOpen, onCreate }) => {
    const { token } = useAuth();

    const [name, setName] = useState<string>("");
    const [selectedFormat, setSelectedFormat] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formats = ["pdf", "txt"];

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name || !selectedFormat) {
            setError("Todos os campos são obrigatórios.");
            toast.info("Todos os campos são obrigatórios.");
            return;
        }

        const formData = {
            nome: name,
            formato: selectedFormat,
            descricao: description,
        };

        setIsSubmitting(true);

        try {
            const response = await api.post("/tipo-documentos/cadastrar", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                const novoTipoDocumento: ITipoDocumento = response.data;
                onCreate(novoTipoDocumento);
                toast.success("Tipo de documento criado com sucesso.");
                onClose();
            } else {
                console.warn("A criação falhou com status:", response.status);
                setError("Falha ao criar tipo de documento.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar novo tipo:", error);
            setError("Erro ao cadastrar tipo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            id="select-modal"
            aria-hidden="true"
            className={`fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full ${isOpen ? "" : "hidden"}`}
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cadastrar novo tipo de documento</h3>
                        <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <div className="flex">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do novo tipo</label>
                                    <label className="text-sm font-medium text-red-600 ml-1">*</label>
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <div className="flex">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selecionar formato</label>
                                    <label className="text-sm font-medium text-red-600 ml-1">*</label>
                                </div>
                                <select
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="" disabled hidden>Selecionar formato</option>
                                    {formats.map((format) => (
                                        <option key={format} value={format}>{format}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-16 p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <button
                                onClick={submit}
                                type="submit"
                                className="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Cadastrando..." : "Cadastrar tipo"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDocumentNewType;
