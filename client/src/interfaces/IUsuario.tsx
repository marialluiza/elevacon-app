export type IUsuario = {
    idUsuario: number;
    login: string;
    senha: string;
    status: 'NOVO' | 'ATIVO' | 'INATIVO';
}