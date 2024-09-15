import { RedeSocial } from "./class_redeSocial";
import prompt from 'prompt-sync';
import { Usuario } from "./class_usuario";
import {z} from "zod";
import { apelidoSchema, conteudoSchema, documentoSchema, emailSchema, idSchema } from "../zod_schemas/zodSchemas";
import { AplicationError, AppError } from "./class_AplicationError";
import { Publicacao } from "./class_publicacao";
import { PublicacaoAvancada } from "./class_publicacaoAvancada";



class App {

    private _logo: string;
    private _redesocial: RedeSocial;
    private _input = prompt();

    constructor (redesocial: RedeSocial) {
        this._redesocial = redesocial;
        this._logo = "███╗   ███╗██╗██████╗  ██████╗\n"+
        "████╗ ████║██║██╔══██╗██╔════╝\n"+
        "██╔████╔██║██║██████╔╝██║     \n"+
        "██║╚██╔╝██║██║██╔══██╗██║     \n"+
        "██║ ╚═╝ ██║██║██║  ██║╚██████╗\n"+
        "╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝"          
    }


    telaPrincipal(): void {
        console.clear();
        console.log();
        console.log(this._logo);
        
        console.log();
        console.log();
        console.log(
            " [1] Cadastrar Usuário          [2] Listar Usuarios          [3] Postar\n",
            "[4] Listar Postagens          [5] xxxxxxxxxx          [6] xxxxxxxxxx\n",
            "[7] xxxxxxxxxx          [8] xxxxxxxxxx          [9] xxxxxxxxxx\n",
        );
    }

    telaCadastrarUsuario(): void {
        let repetir: string = "";
        
        do {
            try {

                console.clear();
                console.log("CADASTRO DE NOVO USUÁRIO !!");
                console.log();
    
                console.log("insira os dados solicitados abaixo");
                console.log();
            
                const apelido: string = this._input("Apelido: ");
                apelidoSchema.parse(apelido);
                
                const email: string = this._input("E-mail: ");
                emailSchema.parse(email);
                
                const documento: string = this._input("Documento (CPF): ");
                documentoSchema.parse(documento);
                
                const id: number = this._redesocial.controleIdUsuario;
    
                console.log();
    
                const usuario:Usuario = new Usuario(id, apelido.toLowerCase(), email.toLowerCase(), documento);
    
                this._redesocial.adicionarUsuario(usuario);
    
                console.log("Usuário cadastrado");
                
    
            } catch (e: any) {
                if (e instanceof z.ZodError){
                    //console.log(e.errors[0].message);
                    console.log(e.errors.map(err => err.message));
                } else if ( e instanceof AplicationError)  {
                    console.log(e.message);
                } else {
                    console.log("Erro Desconhecido. Contate o Administrador:\n", e);
                }
            }

            console.log();
            repetir = this._input("Cadastrar novo Usuário? [s/n]: ");

        } while (repetir.toLowerCase() === 's');
    }

    TelaListarUsusario (): void {

        let repetir: string = "";

        do {

            try{
                console.clear();
                console.log("LISTAGEM DE USUÁRIOS");
                console.log();
    
                this._redesocial.listarUsuarios();

            }catch(e){
                if (e instanceof z.ZodError){
                    //console.log(e.errors[0].message);
                    console.log(e.errors.map(err => err.message));
                } else if ( e instanceof AplicationError)  {
                    console.log(e.message);
                } else {
                    console.log("Erro Desconhecido. Contate o Administrador:\n", e);
                }
            }
            
            console.log();
            repetir = this._input("Listar novamente? [s/n]: ");

        } while (repetir.toLowerCase() ==="s");

    }


    telaInserirPublicacao(): void {
        let repetir: string = "";

        do {
            try {
                console.clear();
                console.log();
                console.log("NOVA POSTAGEM");
                console.log();
                
                // Recebe o apelido do usuário
                const apelido: string = this._input("Usuário (apelido): ");
                console.log();

                // Verifica se o usuário existe
                const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                // Pergunta ao usuário se deseja criar uma publicação avançada
                console.log("Qual o Tipo de Postagem? \n [1] Postagem Simples\n [2] Postagem Avançada");
                console.log();
                const tipoPublicacao: string = this._input("R: ");
                console.log();

                // inicializa o conteudo vazio
                let conteudo: string = "";

                switch (tipoPublicacao) {
                    case "1":
                         // Recebe o conteúdo da publicação
                        console.log("Conteúdo da publicação:\n");
                        conteudo = this._input("> ");
                        conteudoSchema.parse(conteudo);

                        const publicacao = new Publicacao(this._redesocial.controleIdPublicacao, usuario, conteudo);
                        this._redesocial.adicionarPublicacao(publicacao);
                        console.log("Postagem Simples com sucesso !!");

                        break;
                    
                    case "2":
                        // Recebe o conteúdo da publicação
                        console.log("Conteúdo da publicação:\n");
                        conteudo = this._input("> ");
                        conteudoSchema.parse(conteudo);

                        const publicacaoAvancada = new PublicacaoAvancada(this._redesocial.controleIdPublicacao, usuario, conteudo);
                        this._redesocial.adicionarPublicacaoAvancada(publicacaoAvancada);
                        console.log("Postagem Avançada com sucesso !!");

                        break;

                    default:
                        throw new AppError ("\nOpção Inválida !!");
                }
            } catch (e) {
                if (e instanceof z.ZodError) {
                    //console.log(e.errors[0].message);
                    console.log(e.errors.map(err => err.message));
                } else if (e instanceof AplicationError) {
                    console.log(e.message);
                } else {
                    console.log("Erro Desconhecido. Contate o Administrador:\n", e);
                }
            }
            
            console.log();
            repetir = this._input("Inserir nova postagem? [s/n]: ");

        } while (repetir.toLowerCase() === 's');
    }


    telaListarPublicacoes(): void {
        let repetir: string = "";
    
        do {
            try {
                console.clear();
                console.log();
                console.log("-------------- FEED DE POSTAGENS --------------");
                console.log();
    
                // Chama o método da RedeSocial para listar as publicações
                this._redesocial.listarPublicacoes();
    
            } catch (e) {
                if (e instanceof z.ZodError) {
                    console.log(e.errors.map(err => err.message));
                } else if (e instanceof AplicationError) {
                    console.log(e.message);
                } else {
                    console.log("Erro Desconhecido. Contate o Administrador:\n", e);
                }
            }
    
            console.log();
            repetir = this._input("Listar novamente? [s/n]: ");
    
        } while (repetir.toLowerCase() === 's');
    }
    
}

export {App}
