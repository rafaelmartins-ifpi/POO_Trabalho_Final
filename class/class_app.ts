import { RedeSocial } from "./class_redeSocial";
import prompt from 'prompt-sync';
import { Usuario } from "./class_usuario";
import {z} from "zod";
import { apelidoSchema, conteudoSchema, documentoSchema, emailSchema, idSchema } from "../zod_schemas/zodSchemas";
import { AplicationError, AppError } from "./class_AplicationError";
import { Publicacao } from "./class_publicacao";
import { PublicacaoAvancada } from "./class_publicacaoAvancada";
import { limparTela, TipoInteracao } from "../utils";
import { Interacao } from "./class_interacao";
import {format} from 'date-fns';
import fs from 'fs'; 
import { Comentario } from "./class_comentario";


class App {

    private _redesocial: RedeSocial;
    private _logo: string;
    private _larguraPagina: number;
    private _input = prompt();

    constructor (redesocial: RedeSocial) {
        this._redesocial = redesocial;
        this._larguraPagina = 92;
        
        this._logo = "\t███╗   ███╗██╗██████╗  ██████╗\n"+
        "\t████╗ ████║██║██╔══██╗██╔════╝\n"+
        "\t██╔████╔██║██║██████╔╝██║     \n"+
        "\t██║╚██╔╝██║██║██╔══██╗██║     \n"+
        "\t██║ ╚═╝ ██║██║██║  ██║╚██████╗\n"+
        "\t╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝"          
    }

    get redesocial(): RedeSocial {
        return this._redesocial;
    }


    exibirCabecalho(titulo: string): void{
        const espacoDisponivel = this._larguraPagina - titulo.length - 2;
        const espacosEsquerda = Math.floor(espacoDisponivel / 2);
        //const espacosDireita = espacoDisponivel - espacosEsquerda;
          
        console.log("~".repeat(this._larguraPagina)); // Linha superior com '~'
        console.log(` ${' '.repeat(espacosEsquerda)}${titulo}`);
        //console.log(` ${' '.repeat(espacosEsquerda)}${titulo}${' '.repeat(espacosDireita)} `); // Título centralizado
        console.log("~".repeat(this._larguraPagina)); // Linha inferior com '~'
        console.log();
    
    }


    telaPrincipal(): void {
        limparTela();
        console.log();
        console.log(this._logo);
        
        console.log();
        console.log();
        console.log(
            " [1] Cadastrar Usuário          [2] Listar Usuarios         [3] Postar\n",
            "[4] FEED de Postagens          [5] Interagir               [6] Listar Postagens por Usuario\n",
            "[7] Editar Postagem            [8] Comentar                [9] Relatório de Interações\n",
            "[10] Relatório de Comentários  [0] Sair\n"
        );
    }


    telaCadastrarUsuario(): void {
        let repetir: string = "";
        
        do {
            try {

                limparTela();
                this.exibirCabecalho("CADASTRO DE USUÁRIO");
                
                console.log("insira os dados solicitados abaixo");
                console.log();
            
                const apelido: string = this._input("Apelido: ").toLowerCase();
                apelidoSchema.parse(apelido);
                this._redesocial.validarApelidoUsuario(apelido);
                
                const email: string = this._input("E-mail: ");
                emailSchema.parse(email);
                this._redesocial.validarEmailUsuario(email);
                
                const documento: string = this._input("CPF [números]: ");
                documentoSchema.parse(documento);
                this._redesocial.validarDocumentoUsuario(documento);
                
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


    telaListarUsusario (): void {

        let repetir: string = "";

        do {

            try{
                limparTela();
                this.exibirCabecalho("RELATÓRIO DE USUÁRIOS");
                
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
                limparTela();
                this.exibirCabecalho("POSTAR");
                
                // Recebe o apelido do usuário
                const apelido: string = this._input("Usuário (apelido): ").toLowerCase();
                console.log();

                // Verifica se o usuário existe
                const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                // Pergunta ao usuário se deseja criar uma publicação avançada
                console.log("Qual o Tipo de Postagem? \n [1] Postagem Simples\n [2] Postagem Avançada");
                console.log();
                const opTipo: string = this._input("R: ");
                
                // Verifica se a opção é válida
                if (opTipo !== "1" && opTipo !== "2") {
                    throw new AppError("\nOpção Inválida");
                }

                // inicializa o conteudo vazio
                let conteudo: string = "";


                // Recebe o conteúdo da publicação
                console.log();
                console.log("Conteúdo da publicação:\n");
                conteudo = this._input("> ");
                conteudoSchema.parse(conteudo);

                switch (opTipo) {
                    case "1":
                        
                        const publicacao = new Publicacao(this._redesocial.controleIdPublicacao, usuario, conteudo, new Date());
                        this._redesocial.adicionarPublicacao(publicacao);
                        console.log("\nPostagem Simples com sucesso.");

                        break;
                    
                    case "2":
                      
                        const publicacaoAvancada = new PublicacaoAvancada(this._redesocial.controleIdPublicacao, usuario, conteudo, new Date());    
                        this._redesocial.adicionarPublicacao(publicacaoAvancada);
                        console.log("\nPostagem Avançada com sucesso.");

                        break;

                    default:
                        throw new AppError ("\nOpção Inválida.");
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
                limparTela();
                this.exibirCabecalho("FEED DE POSTAGENS");
    
                // Chama o método da RedeSocial para listar as publicações
                const publicacoes: Publicacao[] = this._redesocial.listarPublicacoes();
      
                console.log();
                publicacoes.forEach((publicacao: Publicacao) => {
                    console.log("┌────────────────────────────────────────────────────────────────────┐");
                    console.log(`  [${publicacao.id}] ${publicacao.usuario.apelido}, em ${format(publicacao.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
                    console.log();
                    console.log();
                    console.log("\t"+publicacao.conteudo);

                    // Se a publicação for uma PublicacaoAvancada, exibe as interações
                    if (publicacao instanceof PublicacaoAvancada) {
                        console.log();
                        console.log();  
                        console.log(`  ${(publicacao as PublicacaoAvancada).listarInteracoesPublicacao()}`);
                    }

                    console.log();
                    console.log("└────────────────────────────────────────────────────────────────────┘");
                    console.log();

                    //exibindo os comentários
                    publicacao.comentarios.forEach((comentario) => {
                        console.log("\t┌───────── ");
                        console.log(`\t [${comentario.id}] ${comentario.usuario.apelido}, em ${format(comentario.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
                        console.log();
                        console.log(`\t  ${comentario.texto}`);
                        console.log();
                        console.log("\t└───────── ");
                        console.log();
                    })
                    console.log();
                });
    
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


    telaInteragir(): void {
        let repetir: string = "";

        do {
            try {
                limparTela();
                this.exibirCabecalho("INTEGRAGIR EM POSTAGENS");

                // Recebe o ID da publicação
                const idPublicacao: number = Number(this._input("Publicação [Id]: "));
                idSchema.parse(idPublicacao);
                const publicacao = this._redesocial.encontrarPublicacaoPorId(idPublicacao);

                if (!(publicacao instanceof PublicacaoAvancada)) {
                    throw new AppError("\nPublicação selecionada não é uma Publicação Avançada.");
                }

                // Recebe o apelido do usuário
                console.log();
                console.log("Quem vai interagir?");
                console.log();
                const apelido: string = this._input("Usuário [apelido]: ").toLowerCase();
                const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                // verifica se o usuário já interagiu na publicação e lança a excessão
                if ((publicacao as PublicacaoAvancada).usuariosInteragiram.includes(apelido)){
                    throw new AppError (`\n${usuario.apelido} já interagiu nessa publicacao`);
                }

                // verifica se o usuário está interagindo em sua própria publicação
                if (usuario === publicacao.usuario){
                    throw new AppError ("\nVocê não pode interagir em sua própria publicação.");
                }

                // Recebe o tipo de interação
                console.log();
                console.log("Tipos de Interação:\n [1] Like\n [2] Dislike\n [3] Riso\n [4] Aplauso\n [5] Amor");
                console.log();
                const tipoInteracao: string = this._input("Opção: ");
                let tipo: TipoInteracao;

                switch (tipoInteracao) {
                    case "1":
                        tipo = TipoInteracao.Like;
                        break;
                    case "2":
                        tipo = TipoInteracao.Dislike;
                        break;
                    case "3":
                        tipo = TipoInteracao.Riso;
                        break;
                    case "4":
                        tipo = TipoInteracao.Aplauso;
                        break;
                    case "5":
                        tipo = TipoInteracao.Amor;
                        break;
                    default:
                        throw new AppError("\nOpção Inválida");
                }

                const interacao = new Interacao(this._redesocial.controleIdInteracao, publicacao, tipo, usuario, new Date());

                // Adiciona a interação à publicação
                this._redesocial.adicionarInteracao(publicacao, interacao);

                console.log("\nInteração registrada com sucesso!");

            } catch (e) {
                if (e instanceof z.ZodError) {
                    console.log(e.errors.map(err => err.message));
                } else if (e instanceof AppError) {
                    console.log(e.message);
                } else {
                    console.log("\nErro Desconhecido. Contate o Administrador:\n", e);
                }
            }

            console.log();
            repetir = this._input("Interagir novamente? [s/n]: ");

        } while (repetir.toLowerCase() === 's');
    }


    telaComentar(): void {
        let repetir: string = "";

        do {
            try {
                limparTela();
                this.exibirCabecalho("COMENTAR POSTAGEM");

                // Recebe o ID da publicação
                console.log("Qual a publicação que deseja comentar?");
                const idPublicacao: number = Number(this._input("Publicação [Id]: "));
                idSchema.parse(idPublicacao);
                const publicacao: Publicacao = this._redesocial.encontrarPublicacaoPorId(idPublicacao);

                // Recebe o apelido do usuário
                console.log();
                console.log("Quem vai comentar?");
                console.log();
                const apelido: string = this._input("Usuário [apelido]: ").toLowerCase();
                const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                console.log();
                console.log("Comentário:\n");
                const texto = this._input("> ");
                conteudoSchema.parse(texto);
                const comentario: Comentario = new Comentario(this._redesocial.controleIdComentario, publicacao, usuario, texto, new Date());

                // Adiciona a comentário à publicação
                this._redesocial.adicionarComentario(publicacao, comentario);

                console.log("\nComentário registrado com sucesso!");

            } catch (e) {
                if (e instanceof z.ZodError) {
                    console.log(e.errors.map(err => err.message));
                } else if (e instanceof AppError) {
                    console.log(e.message);
                } else {
                    console.log("\nErro Desconhecido. Contate o Administrador:\n", e);
                }
            }

            console.log();
            repetir = this._input("Comentar novamente? [s/n]: ");

        } while (repetir.toLowerCase() === 's');
    }


    telaListarPublicacoesPorUsuario(): void{
        let repetir: string = "";
    
        do {
            try {
                limparTela();
                this.exibirCabecalho("POSTAGEM DE USUÁRIO");
                
                const apelido: string = this._input("Usuario (apelido): ").toLowerCase();
                const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                console.log();
                console.log(`# FEED DE ${apelido.toUpperCase()}`);
                console.log();
    
                // Chama o método da RedeSocial para receber a lista de publicações do usuário
                const publicacoesUsuario: Publicacao[] = this._redesocial.listarPublicacoesUsuario(usuario);

                console.log();
                publicacoesUsuario.forEach((publicacao: Publicacao) => {
                    console.log("┌────────────────────────────────────────────────────────────────────┐");
                    console.log(`  [${publicacao.id}] ${publicacao.usuario.apelido}, em ${format(publicacao.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
                    console.log();
                    console.log();
                    console.log("\t"+publicacao.conteudo);

                    // Se a publicação for uma PublicacaoAvancada, exibe as interações
                    if (publicacao instanceof PublicacaoAvancada) {
                        console.log();
                        console.log();  
                        console.log(`  ${(publicacao as PublicacaoAvancada).listarInteracoesPublicacao()}`);
                    }

                    console.log();
                    console.log("└────────────────────────────────────────────────────────────────────┘");
                    console.log();

                    //exibindo os comentários
                    publicacao.comentarios.forEach((comentario) => {
                        console.log("\t┌───────── ");
                        console.log(`\t[${comentario.id}] ${comentario.usuario.apelido}, em ${format(comentario.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
                        console.log();
                        console.log(`\t  ${comentario.texto}`);
                        console.log();
                        console.log("\t└───────── ");
                        console.log();
                    })
                    console.log();
                });
    
    
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


    telaListarInteracoes (): void {

        let repetir: string = "";

        do {

            try{
                limparTela();
                this.exibirCabecalho("RELATÓRIO DE INTERAÇÕES");
    
                const interacoes: Interacao[] = this._redesocial.listarInteracoes();
                console.log();
                interacoes.forEach((interacao: Interacao) => {
                    console.log();
                    console.log(`Usuário[Id]: ${interacao.usuario.id} - Interacao[Id]: ${interacao.id} - Tipo: ${interacao.tipoInteracao} - Publicação[id]: ${interacao.publicacao.id} - Data/Hora: ${format(interacao.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
                });
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
            repetir = this._input("Gerar relatório novamente? [s/n]: ");

        } while (repetir.toLowerCase() ==="s");

    }


    telaListarComentarios (): void {

        let repetir: string = "";

        do {

            try{
                limparTela();
                this.exibirCabecalho("RELATÓRIO DE COMENTÁRIOS");
    
                const comentarios: Comentario[] = this._redesocial.listarComentarios();
                console.log();
                comentarios.forEach((comentario: Comentario) => {
                    console.log();
                    console.log(`Comentário[id]: ${comentario.id} - Usuário: ${comentario.usuario.apelido} - Publicação[Id]: ${comentario.publicacao.id} - em ${format(comentario.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
                    console.log(`Texto: "${comentario.texto}"`);
                });
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
            repetir = this._input("Gerar relatório novamente? [s/n]: ");

        } while (repetir.toLowerCase() ==="s");

    }


    telaListarControleIds (): void {

        let repetir: string = "";

        do {

            try{
                limparTela();
                this.exibirCabecalho("RELATÓRIO CONTROLE DE IDs");
    
                console.log(`Controle IdUsuário: ${this._redesocial.controleIdUsuario}`);
                console.log(`Controle IdPublicação: ${this._redesocial.controleIdPublicacao}`);
                console.log(`Controle IdInteracao: ${this._redesocial.controleIdInteracao}`);

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
            repetir = this._input("Gerar relatório novamente? [s/n]: ");

        } while (repetir.toLowerCase() ==="s");

    }


    telaEditarPublicacao(): void {
        let repetir: string = "";

        do {
            try {
                limparTela();
                this.exibirCabecalho("EDITAR POSTAGEM");

                
                const apelido: string = this._input("Usuário (apelido): ");
                const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                // Recebe o ID da publicação
                console.log();
                const idPublicacao: number = Number(this._input("Publicação [Id]: "));
                const publicacao = this._redesocial.encontrarPublicacaoPorId(idPublicacao);

                if (publicacao.usuario !== usuario) {
                    throw new AppError("\nVocê pode editar publicação de outro usuário.");
                }

                // Recebe o novo conteúdo da publicação
                console.log();
                console.log("Novo conteúdo da publicação:\n");
                const novoConteudo: string = this._input("> ");
                conteudoSchema.parse(novoConteudo);

                // Atualiza o conteúdo da publicação
                this._redesocial.editarPublicacao(usuario, publicacao, novoConteudo);

                console.log("\nPublicação atualizada com sucesso!");

            } catch (e) {
                if (e instanceof z.ZodError) {
                    console.log(e.errors.map(err => err.message));
                } else if (e instanceof AplicationError) {
                    console.log(e.message);
                } else {
                    console.log("\nErro Desconhecido. Contate o Administrador:\n", e);
                }
            }

            console.log();
            repetir = this._input("Editar outra publicação? [s/n]: ");

        } while (repetir.toLowerCase() === 's');
    }

}
    

export {App}
