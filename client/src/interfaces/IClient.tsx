import { IContador } from "./IContador";
import { IUsuario } from "./IUsuario";

export type IClient = {
    id_cliente: number;
    nome: string;
    data_nascimento: string;
    ocupacao_principal: string;
    email: string;
    senha: string;
    senhaGerada: string;
    titulo_eleitoral: string;
    cpf: string;
    telefone: string;
    id_contador: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    nome_conjugue: string;
    cpf_conjugue: string;
    observacao: string;

    usuario: IUsuario;
    contador: IContador;
};