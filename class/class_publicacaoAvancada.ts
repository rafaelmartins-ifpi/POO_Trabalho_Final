import { Publicacao } from "./class_publicacao";
import { Interacao } from "./class_interacao";
import { Usuario } from "./class_usuario";
import { TipoInteracao } from "../utils";


class PublicacaoAvancada extends Publicacao {

    private _interacoes: Interacao[] = [];
    private _contadorInteracoes: {[key: string]: number} = {};

    constructor (id: number, usuario: Usuario, conteudo: string) {
        super(id, usuario, conteudo);
        this.inicializarContadores();
    }

    private inicializarContadores (): void {
        for (const tipo of Object.values(TipoInteracao)) {
            this._contadorInteracoes[tipo] = 0;
        }
    }

    get interacoes() {
        return this._interacoes;
    }

    private adicionarInteracao (interacao: Interacao): void {
        this._interacoes.push(interacao);
        this._contadorInteracoes[interacao.tipoIteracao]++;
    }

    private totalInteracoes (): number {
        return this._interacoes.length;
    }

};


export {PublicacaoAvancada};