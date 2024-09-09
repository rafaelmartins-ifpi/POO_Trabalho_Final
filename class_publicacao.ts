import { Usuario } from "./class_usuario";
import {format} from 'date-fns';


class Publicacao {

    private _id: number;
    private _usuario: Usuario;
    private _conteudo: string;
    private _dataHora = new Date();

    constructor (id: number, usuario: Usuario, conteudo: string){
        this._id = id;
        this._usuario = usuario;
        this._conteudo = conteudo;
    }

    get id() {
        return this._id;
    }

    get usuario() {
        return this._usuario;
    }

    get conteudo() {
        return this._conteudo;
    }

    get dataHora() {
        return this._dataHora;
    }
}


export {Publicacao};