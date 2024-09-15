import { Publicacao } from "./class_publicacao";
import { Interacao } from "./class_interacao";
import { Usuario } from "./class_usuario";
import { TipoInteracao } from "../types";
import { AppError } from "./class_AplicationError";


class PublicacaoAvancada extends Publicacao {

    private _interacoes: Interacao[] = [];
    private _contadorInteracoes: {[key: string]: number} = { like: 0, dislike: 0, riso: 0, aplauso: 0, amor: 0};
    private _emojiMap:{ [key: string]: string } = {like: '👍', dislike: '👎', riso: '😂', aplauso: '👏', amor: '❤️'};
    private _usuariosInteragiram : string[] = []; 

    constructor (id: number, usuario: Usuario, conteudo: string) {
        super(id, usuario, conteudo);
    }

    get interacoes() {
        return this._interacoes;
    }

    adicionarInteracao (interacao: Interacao): void {
        
        const apelido = interacao.usuario.apelido;

        if (this._usuariosInteragiram.includes(apelido)){
            throw new AppError (`\nUsuário: ${interacao.usuario.apelido} já interagiu nessa publicacao.`);
        }

        if (this.usuario === interacao.usuario){
            throw new AppError ("\nVocê não pode interagir em sua própria publicação.");
        }

        this._interacoes.push(interacao);
        this._usuariosInteragiram.push(interacao.usuario.apelido);
        this._contadorInteracoes[interacao.tipoIteracao]++;
    }

    totalInteracoes (): number {
        return this._interacoes.length;
    }

    public listarInteracoes(): string {
        return Object.entries(this._contadorInteracoes)
            .map(([tipo, contagem]) => `${this._emojiMap[tipo]} ${contagem}`)
            .join('   ');
    }
};


export {PublicacaoAvancada};