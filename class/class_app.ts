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
    private _currentUser!: Usuario;
    private _input = prompt();

    constructor (redesocial: RedeSocial) {
        this._redesocial = redesocial;
        this._larguraPagina = 92;
        
        this._logo = "\t\t\t\t███╗   ███╗██╗██████╗  ██████╗\n"+
        "\t\t\t\t████╗ ████║██║██╔══██╗██╔════╝\n"+
        "\t\t\t\t██╔████╔██║██║██████╔╝██║     \n"+
        "\t\t\t\t██║╚██╔╝██║██║██╔══██╗██║     \n"+
        "\t\t\t\t██║ ╚═╝ ██║██║██║  ██║╚██████╗\n"+
        "\t\t\t\t╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝"          
    }

    get redesocial(): RedeSocial {
        return this._redesocial;
    }

    get currentUser(){
        return this._currentUser;
    }

    set currentUser(usuario: Usuario){
        this._currentUser = usuario;
    }


    exibirCabecalho(titulo: string, currentUser?: Usuario): void{
        const emojiUsuario = "👤"; // Emoji que representa o usuário
        let textoUsuario: string = ""
        if (!currentUser){
            textoUsuario = emojiUsuario;
        } else {
            textoUsuario = `${emojiUsuario} ${currentUser.apelido}`;
        }
      
        const espacosEntreTituloEUsuario = this._larguraPagina - titulo.length - textoUsuario.length - 2; // Espaço entre título e usuário

        console.log();
        console.log("~".repeat(this._larguraPagina)); // Linha superior com '~'
        console.log(` ${titulo}${' '.repeat(espacosEntreTituloEUsuario)}${textoUsuario} `); // Título à esquerda, emoji e nome do usuário à direita
        console.log("~".repeat(this._larguraPagina)); // Linha inferior com '~'
        console.log();
    }

    exibirComentarioFormatado(comentario: Comentario): void {
        
        console.log("\t┌───────── ");
        console.log(`\t 💬 ${comentario.id} - 👤 ${comentario.usuario.apelido} - 📅 ${format(comentario.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
        console.log();
        console.log(`\t  ${comentario.texto}`);
        console.log();
        console.log("\t└───────── ");
        console.log();
        
    }


    exibirPublicacaoFormatada(publicacao: Publicacao): void {

        console.log("╔════════════════════════════════════════════════════════════════════╗");
        console.log(` 📝 ${publicacao.id} - 👤 ${publicacao.usuario.apelido} - 📅 ${format(publicacao.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
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
        console.log("╚════════════════════════════════════════════════════════════════════╝");            
        console.log();

    }

    telaLogin(): void {
        
        let repetir: boolean = true;
        
        do {
            try {
                limparTela();
                console.log();
                console.log(this._logo);
                console.log();
                console.log();
       
                const espacoDisponivel = this._larguraPagina - 7;
                const espacosEsquerda = Math.floor(espacoDisponivel / 2);
                //const espacosDireita = espacoDisponivel - espacosEsquerda;
                console.log("~".repeat(this._larguraPagina)); // Linha superior com '~'
                console.log(`${' '.repeat(espacosEsquerda)}LOGIN`);
                //console.log( ${' '.repeat(espacosEsquerda)}${titulo}${' '.repeat(espacosDireita)} ); // Título centralizado
                console.log("~".repeat(this._larguraPagina)); // Linha inferior com '~'
                console.log();

                console.log("Para novo cadastro digite: #");
                console.log();

                const apelido = this._input("Usuário [Apelido]: ");

                if (apelido === "#"){
                    this.telaCadastrarUsuario();
                    continue;
                }

                const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);
                this.currentUser = usuario;
                repetir = false;
    
            } catch (e: any) {
                if (e instanceof z.ZodError){
                    //console.log(e.errors[0].message);
                    console.log(e.errors.map(err => err.message));
                } else if ( e instanceof AplicationError)  {
                    console.log(e.message);
                } else {
                    console.log("Erro Desconhecido. Contate o Administrador:\n", e);
                }
                console.log();
                this._input("[enter]");
            }

            console.log();

        } while (repetir);


    }


    telaPrincipal(): void {
        limparTela();
        this.exibirCabecalho("MIRC - PÁGINA INICIAL",this.currentUser);
        
        console.log();
        console.log();
        console.log(
            " [1] Minhas Postagens          [2] Postagens de Usuário    [3] FEED de Postagens\n",
            "[4] Postar                    [5] Comentar                [6] Interagir\n",
            "[7] Editar Postagem           [8] Editar Comentário       [9] Ver Usuários\n",
            "[10] Administrador            [0] LogOff                  [#] Sair"
        );
    }


    telaCadastrarUsuario(): void {
        let repetir: string = "";
        
        do {
            try {

                limparTela();
                this.exibirCabecalho("MIRC - CADASTRO DE USUÁRIO",this.currentUser);
                
                console.log("insira os dados solicitados abaixo");
                console.log();
                console.log("Para tela de Login, digite #");
                console.log("");
            
                const apelido: string = this._input("Apelido: ").toLowerCase();

                if (apelido === "#"){
                    this.telaLogin();
                    break;
                }

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
                console.log();
                this.exibirCabecalho("USUÁRIOS CADASTRADOS",this.currentUser);

                const usuarios: Usuario[] = this._redesocial.listarUsuarios();

                if (this.currentUser.apelido === "admin") {
                    usuarios.forEach((usuario: Usuario) => {
                        console.log();
                        console.log(`👤 ${usuario.apelido} - [Id]: ${usuario.id} - [CPF]: ${usuario.documento} - [Email]: ${usuario.email}`);
                    });
                } else {
                    const apelidos = usuarios.map(u => u.apelido);
                    const colunas = 3;
                    for (let i = 0; i < apelidos.length; i += colunas) {
                        const coluna1 = apelidos[i] ? `👤 ${apelidos[i].padEnd(15)}` : '';
                        const coluna2 = apelidos[i + 1] ? `👤 ${apelidos[i + 1].padEnd(15)}` : '';
                        const coluna3 = apelidos[i + 2] ? `👤 ${apelidos[i + 2].padEnd(15)}` : '';
                        console.log(`${coluna1} ${coluna2} ${coluna3}`.trim());
                    }
                }
                console.log();
                //console.log("USUÁRIOS CADASTRADOS:");
                

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
                this.exibirCabecalho("POSTAR",this.currentUser);
                
                // Recebe o apelido do usuário
                // const apelido: string = this._input("Usuário (apelido): ").toLowerCase();
                // console.log();

                // // Verifica se o usuário existe
                // const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

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
                console.log("Postagem ✍️");
                conteudo = this._input("> ");
                conteudoSchema.parse(conteudo);

                switch (opTipo) {
                    case "1":
                        
                        const publicacao = new Publicacao(this._redesocial.controleIdPublicacao, this.currentUser, conteudo, new Date());
                        this._redesocial.adicionarPublicacao(publicacao);
                        console.log("\nPostagem Simples com sucesso.");

                        break;
                    
                    case "2":
                      
                        const publicacaoAvancada = new PublicacaoAvancada(this._redesocial.controleIdPublicacao, this.currentUser, conteudo, new Date());    
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
                this.exibirCabecalho("FEED DE POSTAGENS", this.currentUser);
    
                // Chama o método da RedeSocial para listar as publicações
                const publicacoes: Publicacao[] = this._redesocial.listarPublicacoes();
      
                console.log();
                publicacoes.forEach((publicacao: Publicacao) => {
                    
                    // exibe a publicação em formato mais legível
                    this.exibirPublicacaoFormatada(publicacao);

                    //exibindo os comentários da publicação
                    publicacao.comentarios.forEach((comentario) => {
                        this.exibirComentarioFormatado(comentario);
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
                this.exibirCabecalho("INTEGRAGIR EM POSTAGENS", this.currentUser);

                // Recebe o ID da publicação
                console.log("Qual a publicação que deseja interagir?");
                const idPublicacao: number = Number(this._input("Publicação [Id]: "));
                idSchema.parse(idPublicacao);
                const publicacao = this._redesocial.encontrarPublicacaoPorId(idPublicacao);
                console.log();

                this.exibirPublicacaoFormatada(publicacao);

                if (!(publicacao instanceof PublicacaoAvancada)) {
                    throw new AppError("\nPublicação selecionada não é uma Publicação Avançada");
                }

                // Recebe o apelido do usuário
                // console.log();
                // console.log("Quem vai interagir?");
                // console.log();
                // const apelido: string = this._input("Usuário [apelido]: ").toLowerCase();
                // const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                // verifica se o usuário já interagiu na publicação e lança a excessão
                if ((publicacao as PublicacaoAvancada).usuariosInteragiram.includes(this.currentUser.apelido)){
                    throw new AppError (`\nVocê já interagiu nessa publicacao`);
                }

                // verifica se o usuário está interagindo em sua própria publicação
                if (this.currentUser === publicacao.usuario){
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

                const interacao = new Interacao(this._redesocial.controleIdInteracao, publicacao, tipo, this.currentUser, new Date());

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
                this.exibirCabecalho("COMENTAR POSTAGEM", this.currentUser);

                // Recebe o ID da publicação
                console.log("Qual a publicação que deseja comentar?");
                const idPublicacao: number = Number(this._input("Publicação [Id]: "));
                idSchema.parse(idPublicacao);
                const publicacao: Publicacao = this._redesocial.encontrarPublicacaoPorId(idPublicacao);
                console.log();

                this.exibirPublicacaoFormatada(publicacao);

                // Recebe o apelido do usuário
                // console.log();
                // console.log("Quem vai comentar?");
                // console.log();
                // const apelido: string = this._input("Usuário [apelido]: ").toLowerCase();
                // const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                console.log();
                console.log("Comentário ✍️");
                const texto = this._input("> ");
                conteudoSchema.parse(texto);
                const comentario: Comentario = new Comentario(this._redesocial.controleIdComentario, publicacao, this.currentUser, texto, new Date());

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

    // se rebebe o curretUser (mostra as postagens dele), 
    // se não (pergunta de qual usuario quer ver as postagens)
    telaListarPublicacoesPorUsuario(currentUser?: Usuario): void{
        let repetir: string = "";
    
        do {
            try {
                limparTela();
                console.log();

                let usuario: Usuario;
                
                if (currentUser){
                    usuario = currentUser;
                    this.exibirCabecalho("MIRC - MINHAS POSTAGENS", usuario);
                } else {
                    this.exibirCabecalho("MIRC - POSTAGENS DE OUTRO USUÁRIO", this.currentUser);
                    console.log();
                    const apelido: string = this._input("Usuario (apelido): ").toLowerCase();
                    usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);
                }               
                console.log();

                console.log(`📝 FEED DE ${usuario.apelido.toUpperCase()}`);
                console.log();
    
                // Chama o método da RedeSocial para receber a lista de publicações do usuário
                const publicacoesUsuario: Publicacao[] = this._redesocial.listarPublicacoesUsuario(usuario);
                console.log();

                publicacoesUsuario.forEach((publicacao: Publicacao) => {
                    this.exibirPublicacaoFormatada(publicacao);

                    //exibindo os comentários
                    publicacao.comentarios.forEach((comentario) => {
                        this.exibirComentarioFormatado(comentario);
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
                this.exibirCabecalho("RELATÓRIO DE INTERAÇÕES", this.currentUser);
    
                const interacoes: Interacao[] = this._redesocial.listarInteracoes();
                console.log();
                interacoes.forEach((interacao: Interacao) => {
                    console.log();
                    console.log(`🤝 [Id]: ${interacao.id} - 👤 [${interacao.usuario.id}] ${interacao.usuario.apelido} - Tipo: ${interacao.tipoInteracao} - 📝 [Postagem]: ${interacao.publicacao.id} - 📅 ${format(interacao.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
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
                this.exibirCabecalho("RELATÓRIO DE COMENTÁRIOS",this.currentUser);
                console.log();
    
                const comentarios: Comentario[] = this._redesocial.listarComentarios();
                console.log();
                comentarios.forEach((comentario: Comentario) => {
                    console.log();
                    console.log(`💬[id]: ${comentario.id} - 👤 ${comentario.usuario.apelido} - 📝[Id]: ${comentario.publicacao.id} - 📅 ${format(comentario.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
                    console.log(`✍️: "${comentario.texto}"`);
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


    RelatorioControleIds (): void {

        let repetir: string = "";

        do {

            try{
                limparTela();
                this.exibirCabecalho("RELATÓRIO CONTROLE DE IDs", this.currentUser);
    
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
                this.exibirCabecalho("EDITAR POSTAGEM", this.currentUser);

                // const apelido: string = this._input("Usuário (apelido): ");
                // const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                // Recebe o ID da publicação
                console.log();
                const idPublicacao: number = Number(this._input("Postagem [Id]: "));
                const publicacao = this._redesocial.encontrarPublicacaoPorId(idPublicacao);
                console.log();

                this.exibirPublicacaoFormatada(publicacao);

                if (publicacao.usuario !== this.currentUser) {
                    throw new AppError("\nVocê pode editar postagem de outro usuário.");
                }

                // Recebe o novo conteúdo da publicação
                console.log();
                console.log("Editar a postagem:\n");
                const novoConteudo: string = this._input("📝 ");
                conteudoSchema.parse(novoConteudo);

                // Atualiza o conteúdo da publicação
                this._redesocial.editarPublicacao(this.currentUser, publicacao, novoConteudo);

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


    telaEditarComentario(): void {
        let repetir: string = "";

        do {
            try {
                limparTela();
                this.exibirCabecalho("EDITAR COMENTÁRIO", this.currentUser);

                // const apelido: string = this._input("Usuário (apelido): ");
                // const usuario: Usuario = this._redesocial.encontrarUsuarioPorApelido(apelido);

                // Recebe o ID da publicação
                console.log();
                const idComentario: number = Number(this._input("Comentario [Id]: "));
                const comentario = this._redesocial.encontrarComentarioPorId(idComentario);
                console.log();

                this.exibirComentarioFormatado(comentario);

                if (comentario.usuario !== this.currentUser) {
                    throw new AppError("\nVocê pode editar postagem de outro usuário.");
                }

                // Recebe o novo conteúdo da publicação
                console.log();
                console.log("Editar a comentário:\n");
                const novoConteudo: string = this._input("💬 ");
                conteudoSchema.parse(novoConteudo);

                // Atualiza o conteúdo da publicação
                this._redesocial.editarComentario(this.currentUser, comentario, novoConteudo);

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


    relatorioPublicacoes(): void {

        let repetir: string = "";

        do {

            try{
                limparTela();
                console.log;
                this.exibirCabecalho("RELATÓRIO DE PUBLICAÇÕES",this.currentUser);
                console.log();
    
                const publicacoes: Publicacao[] = this._redesocial.listarPublicacoes();
           
                publicacoes.forEach((publicacao: Publicacao) => {
                    console.log();
                    console.log(`📝 ${publicacao.id} - 👤 ${publicacao.usuario.apelido} - 📅 ${format(publicacao.dataHora, "dd/MM/yyy 'às' HH:mm")}`);
                    console.log(`✍️ "${publicacao.conteudo}"`);
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
    

    telaAdministrador(): void {
        let repetir: string = "";

        do {
            try {
                limparTela();
                console.log();
                this.exibirCabecalho("ADMINISTRADOR",this.currentUser);
                console.log();
                
                if(this.currentUser.apelido !== "admin"){
                    throw new AppError("Sessão Restrita!\nApenas usuário 👤 admin");
                }
                
                console.log(
                    " [1] Relatório - Controle de ID's        [2] Relatório - Usuários\n",
                    "[3] Relatório - Publicações             [4] Relatório - Comentários\n",
                    "[5] Relatório - Interações              [#] Tela Principal\n"
                );
                
                console.log();
                const op: string = this._input("> ");

                if (op === "#"){
                    this.telaPrincipal();
                    break;
                }
                
                switch (op) {
                    case "1":
                        this.RelatorioControleIds();
                        break;
                    
                    case "2":
                        this.telaListarUsusario();
                        break;
                    
                    case "3":
                        this.relatorioPublicacoes();
                        break;
                        
                    case "4":
                        this.telaListarComentarios();
                        break;
                            
                    case "5":
                        this.telaListarInteracoes();
                        break;
                    case "#":
                        break;

                    default:
                        console.log("\nOpção Inválida");
                        break;
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

                console.log();
                this._input("Voltar para Tela Inicial\n[enter]");
                break;
            }

        } while (repetir !== "#");

    }

}
    

export {App}
