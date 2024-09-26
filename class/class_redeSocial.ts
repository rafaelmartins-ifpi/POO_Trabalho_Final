import { Usuario } from "./class_usuario";
import { Publicacao } from "./class_publicacao";
import { AppError } from "./class_AplicationError";
import { PublicacaoAvancada } from "./class_publicacaoAvancada";
import {format} from 'date-fns';
import { Interacao } from "./class_interacao";
import fs from 'fs';
import { TipoInteracao } from "../utils";
import prompt from "prompt-sync";
import { Comentario } from "./class_comentario";

let input = prompt();




// REDE SOCIAL MIRC

class RedeSocial {

    private _usuarios: Usuario[];
    private _publicacoes: Publicacao[];
    private _interacoes: Interacao[];
    private _comentarios: Comentario[];
    private _controleIdUsuario: number;
    private _controleIdPublicacao: number;
    private _controleIdInteracao: number;
    private _controleIdComentario: number;

    constructor (
        usuarios: Usuario[] = [],
        publicacoes: Publicacao [] = [],
        interacoes: Interacao[] = [],
        comentarios: Comentario[] = [],
        controleIdUsuario: number = 1,    // próximo idUsuário que será utilizado
        controleIdPublicacao: number = 1, // próximo idPublicação que será utilizado
        controleIdInteracao: number = 1,  // próximo idInteracao que será utilizado
        controleIdComentario: number = 1  // próximo idComentario que será utilizado
    ) {
        this._usuarios = usuarios;
        this._publicacoes = publicacoes;
        this._interacoes = interacoes;
        this._comentarios = comentarios;
        this._controleIdUsuario = controleIdUsuario;
        this._controleIdPublicacao = controleIdPublicacao;
        this._controleIdInteracao = controleIdInteracao;
        this._controleIdComentario = controleIdComentario;
    }


    get usuarios() {
        return this._usuarios;
    }


    get publicacoes() {
        return this._publicacoes;
    }

    get interacoes() {
        return this._interacoes;
    }  

    get comentarios() {
        return this._comentarios;
    }

    get controleIdUsuario() {
        return this._controleIdUsuario;
    }

    get controleIdInteracao () {
        return this._controleIdInteracao;
    }

    get controleIdComentario() {
        return this._controleIdComentario;
    }

    get controleIdPublicacao() {
        return this._controleIdPublicacao;
    }

    // verifica se já existe ID cadastrado e lança exceção
    validarIdUsuario (id: number): void {
        if (this._usuarios.some((u: Usuario) => u.id === id)) {
            throw new AppError(`\nJá existe um usuário com o ID: ${id}.`);
        }
    }

    // verifica se já existe apelido cadastrado e lança exceção
    validarApelidoUsuario (apelido: string): void {
        if (this._usuarios.some((u: Usuario) => u.apelido === apelido)) {
            throw new AppError(`\nJá existe um usuário com o apelido: ${apelido}.`);
        } 
    }

    // verifica se já existe email cadastrado e lança exceção
    validarEmailUsuario (email: string): void {
        if (this._usuarios.some((u: Usuario) => u.email === email)) {
            throw new AppError (`\nJá existe um usuário com o e-mail: ${email}.`);
        }
    }

    // verifica se já existe documento cadastrado e lança exceção
    validarDocumentoUsuario (documento: string): void {
        if (this._usuarios.some((u: Usuario) => u.documento === documento)) {
            throw new AppError (`\nJá existe um usuário com o CPF: ${documento}.`);
        }
    }


    encontrarUsuarioPorApelido(apelido: string): Usuario {
        const usuario = this._usuarios.find(u => u.apelido === apelido);
        if (!usuario) {
            throw new AppError(`\nUsuário não encontrado`);
        }
        return usuario;
    }


    encontrarPublicacaoPorId(idPublicacao: number): Publicacao {
        const publicacao = this._publicacoes.find(p => p.id === idPublicacao);
        if (!publicacao) {
            throw new AppError(`\nPublicacação não encontrada`);
        }
        return publicacao;
    }


    encontrarComentarioPorId(idComentario: number): Comentario {
        const comentario = this._comentarios.find(c => c.id === idComentario);
        if (!comentario) {
            throw new AppError(`\nComentario não encontrada`);
        }
        return comentario;
    }


    adicionarUsuario(usuario: Usuario): void {
        this.validarIdUsuario(usuario.id);
        this.validarApelidoUsuario(usuario.apelido);
        this.validarEmailUsuario(usuario.email);
        this.validarDocumentoUsuario(usuario.documento);
        
        if(!(this._usuarios.some((u: Usuario) => u.apelido === "admin") && usuario.apelido === "admin")){
            this._usuarios.push(usuario);
            this._controleIdUsuario +=1;
        }
    }


    adicionarPublicacao(publicacao: Publicacao): void {
        
        // Adiciona a publicação à lista e incrementa o contador de ID
        this._publicacoes.push(publicacao);
        this._controleIdPublicacao += 1;
    }


    adicionarInteracao(publicacao: Publicacao, interacao: Interacao): void {
        
        if (!(publicacao instanceof PublicacaoAvancada)) {
            throw new AppError("\nEsta é uma Publicação Simples. Interações somente em Publicações Avançadas!");
        }
        // Adiciona a interação à publicação a que pertence
        publicacao.adicionarInteracao(interacao);
    
        // Atualiza a lista de interações da publicação
        this._interacoes.push(interacao);
        this._controleIdInteracao += 1;
    }


    adicionarComentario(publicacao: Publicacao, comentario: Comentario): void {
        
        // Adiciona a comentário à publicação que pertence
        publicacao.adicionarComentario(comentario);
    
        // Atualiza o array de Comentário de RedeSocial e incrementa o contador de ID
        this._comentarios.push(comentario);
        this._controleIdComentario += 1;
    }


    listarUsuarios(): Usuario[] {
        if (this._usuarios.length === 0) {
            throw new AppError("\nNão existem usuários cadastradaos.");
        }

        return this._usuarios;
    }


    listarPublicacoes(): Publicacao[] {
        if (this._publicacoes.length === 0) {
            throw new AppError ("\nNenhuma publicação encontrada");
        }

        // Ordena as publicações pela data de criação em ordem decrescente
        const publicacoesOrdenadas: Publicacao[] = [...this._publicacoes].sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

        return publicacoesOrdenadas;
    }


    listarInteracoes(): Interacao[]{
        if (this._interacoes.length === 0){
            throw new AppError("\nnenhuma interação encontrada");
        }

        const interacoesOrdenadas: Interacao[] = [...this._interacoes].sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

        return interacoesOrdenadas;
    }


    listarComentarios(): Comentario[]{
        if (this._comentarios.length === 0){
            throw new AppError("\nnenhum comentário encontrado");
        }

        const comentariosOrdenados: Comentario[] = [...this._comentarios].sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

        return comentariosOrdenados;
    }


    listarPublicacoesUsuario(usuario: Usuario): Publicacao[] {
        const publicacoesOrdenadas: Publicacao[] = [...this._publicacoes].sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

        const publicacoesUsuario = publicacoesOrdenadas.filter(p => p.usuario === usuario);

        if (publicacoesUsuario.length === 0) {
            throw new AppError ("\nNenhuma publicação encontrada.");
        }

        return publicacoesUsuario;
    }


    editarPublicacao(usuario: Usuario, publicacao: Publicacao, novoConteudo: string): void {
        if (usuario !== publicacao.usuario) {
            throw new AppError("\nVocê não pode editar publicação de outro usuário.");
        }

        publicacao.conteudo = novoConteudo;
    }


    editarComentario(usuario: Usuario, comentario: Comentario, novoTexto: string): void {
        if (usuario !== comentario.usuario) {
            throw new AppError("\nVocê não pode editar comentário de outro usuário.");
        }

        comentario.texto = novoTexto;
    }

    salvarDados (arquivoUsuarios:string, arquivoPublicacoes: string, arquivoInteracoes: string, arquivoComentarios: string): void{

        // Criar conteúdo para o CSV de USUÁRIO
        let usuariosContent: string = "USUÁRIOS\r\n";
        for (let usuario of this._usuarios){
            usuariosContent += `${usuario.id};${usuario.apelido};${usuario.email};${usuario.documento}\r\n`;
        }
        // Remover a última linha em branco    
        usuariosContent = usuariosContent.slice(0, usuariosContent.length - 2); // Remover a última linha em branco

        // Criar conteúdo para o CSV das publicações, incluindo o tipo (PS/PA)
        let publicacoesContent: string = "PUBLICAÇÕES\r\n";
        for (let publicacao of this._publicacoes){
            const tipoPublicacao = publicacao instanceof PublicacaoAvancada ? 'PA' : 'PS'; // Verifica o tipo da publicação
            publicacoesContent += `${publicacao.id};${publicacao.usuario.id};${publicacao.conteudo};${publicacao.dataHora};${tipoPublicacao}\r\n`
        }

        publicacoesContent = publicacoesContent.slice(0, publicacoesContent.length - 2); // Remover a última linha em branco

        // Criar conteúdo para o CSV das interações
        let interacoesContent: string = "INTERAÇÕES\r\n";
        for (let interacao of this._interacoes){
            interacoesContent += `${interacao.id};${interacao.publicacao.id};${interacao.tipoInteracao};${interacao.usuario.id};${interacao.dataHora}\r\n`
        }

        interacoesContent = interacoesContent.slice(0, interacoesContent.length - 2); // Remover a última linha em branco

        //Criar conteudo para o CSV dos comentarios
        let comentariosContent: string = "COMENTÁRIOS\r\n";
        for (let comentario of this._comentarios){
            comentariosContent += `${comentario.id};${comentario.publicacao.id};${comentario.usuario.id};${comentario.texto};${comentario.dataHora}\r\n`
        }
        // Remover a última linha em branco
        comentariosContent = comentariosContent.slice(0, comentariosContent.length - 2); 


        // Salvar o conteúdo no arquivo
        fs.writeFileSync(arquivoUsuarios, usuariosContent, 'utf-8');
        fs.writeFileSync(arquivoPublicacoes, publicacoesContent, 'utf-8');
        fs.writeFileSync(arquivoInteracoes, interacoesContent, 'utf-8');
        fs.writeFileSync(arquivoComentarios, comentariosContent, 'utf-8');
    }


    carregarDados (arquivoUsuarios:string, arquivoPublicacoes: string, arquivoInteracoes:string, arquivoComentarios: string): void {
        // Verificar se o arquivo existe
        // if (!(fs.existsSync(arquivoUsuarios) && fs.existsSync(arquivoPublicacoes) && fs.existsSync(arquivoInteracoes) && fs.existsSync(arquivoComentarios))) {
        //     throw new Error('Primeiro Acesso [Arquivo não encontrado]. Iniciando com os dados padrão');
        // }

        // Ler o conteúdo do arquivo CSV
        let usuariosData = fs.readFileSync(arquivoUsuarios, 'utf-8');
        // Carregar usuários
        usuariosData.split('\r\n').slice(1).map(linha => {
            const [id, apelido, email, documento] = linha.split(';');
            const usuario = new Usuario(Number(id), apelido, email, documento);
            //this._usuarios.push(usuario);
            this.adicionarUsuario(usuario);
        });
      
        // Criar um mapa de usuários para facilitar a associação posterior
        const usuarioMap: { [key: number]: Usuario } = {};
        this._usuarios.forEach(usuario => {
            usuarioMap[Number(usuario.id)] = usuario;
        });

        // Carregar publicações
        let publicacoesData = fs.readFileSync(arquivoPublicacoes, 'utf-8');
        publicacoesData.split('\r\n').slice(1).map(linha => {
            const [id, usuarioId, conteudo, dataHora, tipo] = linha.split(';');
            const usuario = usuarioMap[Number(usuarioId)];
            const data = new Date(dataHora);

            if (tipo === 'PA') {
                const publicacao = new PublicacaoAvancada(Number(id), usuario, conteudo, data);
                this.adicionarPublicacao(publicacao);

                //this._publicacoes.push(publicacao);
            } else {
                const publicacao = new Publicacao(Number(id), usuario, conteudo, data);
                this.adicionarPublicacao(publicacao);
                //this._publicacoes.push(publicacao);
            }

        });

        // Criar um mapa de publicações para facilitar a associação posterior
        const publicacaoMap: { [key: number]: Publicacao } = {};
        this._publicacoes.forEach(publicacao => {
            publicacaoMap[Number(publicacao.id)] = publicacao;  
        });
        

        //Carregar interações
        let interacoesData = fs.readFileSync(arquivoInteracoes, 'utf-8');
        interacoesData.split('\r\n').slice(1).map(linha => {
            const [id, publicacaoId, tipoInteracao, usuarioId, dataHora] = linha.split(';');
            const publicacao = publicacaoMap[Number(publicacaoId)];
            const usuario = usuarioMap[Number(usuarioId)];
            const data = new Date(dataHora);
            const tipo = tipoInteracao as TipoInteracao;

            const interacao = new Interacao(Number(id), publicacao, tipo, usuario, data);

            //Se for uma PublicacaoAvancada, atualizar o contador de interações
            if (publicacao instanceof PublicacaoAvancada) {   
                this.adicionarInteracao(publicacao, interacao);
                //publicacao.adicionarInteracao(interacao);
            }

            //this._interacoes.push(interacao);
        });


        // Carregar Comentários
        let comentariosData = fs.readFileSync(arquivoComentarios, 'utf-8');
        comentariosData.split('\r\n').slice(1).map(linha => {
            const [id, publicacaoId, usuarioId, texto, dataHora ] = linha.split(';');
            const publicacao = publicacaoMap[Number(publicacaoId)];
            const usuario = usuarioMap[Number(usuarioId)];
            const data = new Date(dataHora);

            const comentario: Comentario = new Comentario(Number(id), publicacao, usuario, texto, data);
            
            this.adicionarComentario(publicacao, comentario);
        });
        


        // Atualizar os controladores de ID com base nos últimos IDs utilizados
        // this._controleIdUsuario = this._usuarios.length + 1;
        // this._controleIdPublicacao = this._publicacoes.length + 1;
        // this._controleIdInteracao = this._interacoes.length + 1;

    }

}


export {RedeSocial};