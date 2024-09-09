import { Publicacao } from "./class_publicacao";
import { Iteracao } from "./class_interacao";
import { Usuario } from "./class_usuario";


class PublicacaoAvancada extends Publicacao {

    private _iteracoes: Iteracao[] = [];

    constructor (id: number, usuario: Usuario, conteudo: string) {
        super(id, usuario, conteudo);
    }

    get iterracoes() {
        return this._iteracoes;
    }

};


export {PublicacaoAvancada};