import { Publicacao } from "./class_publicacao";
import { Usuario } from "./class_usuario";
import { TipoInteracao } from "../types";
import { idSchema, tipoInteracaoSchema } from "../zod_schemas/zodSchemas";


class Interacao {

    readonly _id: number;
    private _publicacao: Publicacao;
    private _tipoInteracao: TipoInteracao;
    private _usuario: Usuario;
    private _dataHora = new Date();

    constructor (id: number, publicacao: Publicacao, tipoInteracao: TipoInteracao, usuario: Usuario) {
        idSchema.parse(id);
        tipoInteracaoSchema.parse(tipoInteracao);

        this._id = id;
        this._publicacao = publicacao;
        this._tipoInteracao = tipoInteracao;
        this._usuario = usuario;
    }

    get id() {
        return this._id;
    }

    get publicacao() {
        return this._publicacao;
    }

    get tipoIteracao() {
        return this._tipoInteracao;
    }

    get usuario() {
        return this._usuario;
    }

    get dataHora() {
        return this._dataHora;
    }
}

export {Interacao};