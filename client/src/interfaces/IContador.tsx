import { IUsuario } from "./IUsuario";

export type IContador = {
    id_contador: string;
    crc: string;

    usuario: IUsuario;
};