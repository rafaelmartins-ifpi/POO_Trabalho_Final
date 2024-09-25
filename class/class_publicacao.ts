
import { conteudoSchema, idSchema } from "../zod_schemas/zodSchemas";
import { AppError } from "./class_AplicationError";
import { Comentario } from "./class_comentario";
import { Usuario } from "./class_usuario";


class Publicacao {

    readonly _id: number;
    private _usuario: Usuario;
    private _conteudo: string;
    private _dataHora: Date;
    private _comentarios: Comentario[];

    constructor (id: number, usuario: Usuario, conteudo: string, dataHora: Date){
        idSchema.parse(id);
        conteudoSchema.parse(conteudo);

        this._id = id;
        this._usuario = usuario;
        this._conteudo = conteudo;
        this._dataHora = dataHora;
        this._comentarios = [];

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

    get comentarios() {   // retorna os comentário de uma publicação em ordem decrescente
        return this._comentarios.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
    }

    set conteudo (novoConteudo: string) {
        conteudoSchema.parse(novoConteudo);
        this._conteudo = novoConteudo;
        this._dataHora = new Date();
    }

    
    adicionarComentario (comentario: Comentario): void {
        
        const apelido = comentario.usuario.apelido;

        this._comentarios.push(comentario);
    }


    totalComentarios(): number {
        return this._comentarios.length;
    }


    listarComentariosPublicacao(): Comentario[] {
       
        // Ordena as publicações pela data de criação em ordem decrescente
        const comentariosOrdenados: Comentario[] = [...this._comentarios].sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

        return comentariosOrdenados;
    }
}


export {Publicacao};