import { Publicacao } from "./class_publicacao";
import { Usuario } from "./class_usuario";
import { TipoIteracao } from "./utils";


class Iteracao {

    private _id: number;
    private _publicacao: Publicacao;
    private _tipoIteracao: TipoIteracao;
    private _usuario: Usuario;
    private _dataHora = new Date();

    constructor (id: number, publicacao: Publicacao, tipoIteracao: TipoIteracao, usuario: Usuario) {
        this._id = id;
        this._publicacao = publicacao;
        this._tipoIteracao = tipoIteracao;
        this._usuario = usuario;
    }

    get id() {
        return this._id;
    }

    get publicacao() {
        return this._publicacao;
    }

    get tipoIteracao() {
        return this._tipoIteracao;
    }

    get usuario() {
        return this._usuario;
    }

    get dataHora() {
        return this._dataHora;
    }
}

export {Iteracao};