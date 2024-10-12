import { toast } from "sonner";
import { IClient } from "../../../../interfaces/IClient";

interface ModalAccessProps {
  clienteData: IClient;
  onClose: () => void;
  onCancel: () => void;
  isOpen?: boolean;
}

const ModalAccess: React.FC<ModalAccessProps> = ({ clienteData, onClose, onCancel, isOpen }) => {
  const userName = clienteData.email;
  const password = clienteData.senhaGerada; 

  const copyToClipboard = (text: string ) => {
    navigator.clipboard.writeText(text);
    toast.message("Copiado para a área de transferência!");
  };

  return (
    <div 
      id="select-modal" 
      aria-hidden="true" 
      className={`fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full ${isOpen ? '' : 'hidden'}`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informações de acesso
            </h3>
            <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome de usuário</label>
              <div className="flex items-center space-x-2">
                <input type="text" readOnly value={userName} className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={() => copyToClipboard(userName)} className="text-blue-600 hover:text-blue-800">
                  Copiar
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              <div className="flex items-center space-x-2">
                <input type="text" readOnly value={password} className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button onClick={() => copyToClipboard(password)} className="text-blue-600 hover:text-blue-800">
                  Copiar
                </button>
              </div>
            </div>
            <button onClick={onCancel} className="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAccess;
