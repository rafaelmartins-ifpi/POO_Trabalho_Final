import { Usuario } from "./class_usuario";
import { Publicacao } from "./class_publicacao";
import { AppError } from "./class_AplicationError";
import { PublicacaoAvancada } from "./class_publicacaoAvancada";
import {format} from 'date-fns';

// REDE SOCIAL MIRC

class RedeSocial {

    private _usuarios: Usuario[];
    private _publicacoes: Publicacao[];
    private _controleIdUsuario: number;
    private _controleIdPublicacao: number;

    constructor (
        usuarios: Usuario[] = [],
        publicacoes: Publicacao [] = [],
        controleIdUsuario: number = 1,
        controleIdPublicacao: number = 1
    ) {
        this._usuarios = usuarios;
        this._publicacoes = publicacoes;
        this._controleIdUsuario = controleIdUsuario;
        this._controleIdPublicacao = controleIdPublicacao;
    }


    get usuarios() {
        return this._usuarios;
    }


    get publicacoes() {
        return this._publicacoes;
    }


    get controleIdUsuario() {
        return this._controleIdUsuario;
    }


    get controleIdPublicacao() {
        return this._controleIdPublicacao;
    }

    validarIdUsuario (id: number): void {
        if (this._usuarios.some((u: Usuario) => u.id === id)) {
            throw new AppError(`Já existe um usuário com o ID: ${id}.`);
        }
    }

    validarApelidoUsuario (apelido: string): void {
        if (this._usuarios.some((u: Usuario) => u.apelido === apelido)) {
            throw new AppError(`Já existe um usuário com o apelido: ${apelido}.`);
        } 
    }

    validarEmailUsuario (email: string): void {
        if (this._usuarios.some((u: Usuario) => u.email === email)) {
            throw new AppError (`Já existe um usuário com o e-mail: ${email}.`);
        }
    }

    validarDocumentoUsuario (documento: string): void {
        if (this._usuarios.some((u: Usuario) => u.documento === documento)) {
            throw new AppError (`Já existe um usuário com o CPF: ${documento}.`);
        }
    }

    encontrarUsuarioPorApelido(apelido: string): Usuario {
        const usuario = this._usuarios.find(u => u.apelido === apelido);
        if (!usuario) {
            throw new AppError(`Usuário com o apelido ${apelido} não encontrado.`);
        }
        return usuario;
    }

    adicionarUsuario(usuario: Usuario): void {
        this.validarIdUsuario(usuario.id);
        this.validarApelidoUsuario(usuario.apelido);
        this.validarEmailUsuario(usuario.email);
        this.validarDocumentoUsuario(usuario.documento);
        
        this._usuarios.push(usuario);
        this._controleIdUsuario +=1;
    }

    adicionarPublicacao(publicacao: Publicacao): void {
        
        // Adiciona a publicação à lista
        this._publicacoes.push(publicacao);
        this._controleIdPublicacao += 1;
    }

    adicionarPublicacaoAvancada(publicacaoAvancada: PublicacaoAvancada): void {
        this._publicacoes.push(publicacaoAvancada);
        this._controleIdPublicacao += 1;
    }

    listarUsuarios(): void {
        if (this._usuarios.length === 0) {
            throw new AppError("Não existem usuários cadastradaos.");
        }
        
        console.log("Lista de Usuários:");
        this._usuarios.forEach((usuario: Usuario) => {
            console.log();
            console.log(`ID: ${usuario.id}, Apelido: ${usuario.apelido}, Email: ${usuario.email}, Documento: ${usuario.documento}`);
        });
    }

    listarPublicacoes(): void {
        if (this._publicacoes.length === 0) {
            throw new AppError ("Nenhuma publicação encontrada.");
        }

        // Ordena as publicações pela data de criação em ordem decrescente
        const publicacoesOrdenadas: Publicacao[] = [...this._publicacoes].sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

        console.log();
        console.log("-----------------------------------------------------------------");
        console.log();
        publicacoesOrdenadas.forEach((publicacao: Publicacao) => {
            console.log(`ID: ${publicacao.id}`);
            console.log();
            console.log(`Conteúdo: ${publicacao.conteudo}`);
            console.log();
            console.log(`por ${publicacao.usuario.apelido}, em ${format(publicacao.dataHora, "dd/MM/yyy 'às' HH:mm")}`);

            // Se a publicação for uma PublicacaoAvancada, exibe as interações
            if (publicacao instanceof PublicacaoAvancada) {
                console.log(`  ${(publicacao as PublicacaoAvancada).listarInteracoes()}`);
            }

            console.log();
            console.log("-----------------------------------------------------------------");
            console.log();
        });
    }

}




export {RedeSocial};


/*
Crie  uma  classe  de  cadastro  chamada RedeSocial, onde: 

a. Exista  uma  coleção  de  usuários  outra  de publicações e Métodos de inclusão 
e consulta para ambas as coleções; 

b. Implemente as seguintes validações: 
i. Não  deve  ser  possível  cadastrar  usuários 
com o mesmo id e/ou e-mail;  
ii. Não deve ser possível cadastrar id; 
 
As validações devem gerar exceções que 
serão capturadas posteriormente

c. Crie um método para listar todas as publicações em ordem decrescente de acordo  
com  a  data  de  criação  como  se fosse um feed. 
A listagem de publicações deve exibir os detalhes da publicação 
incluindo, nos casos de PublicacoesAvancadas,  a  quantidade  de 
reações  e  mais  algum  detalhe  que  julgar relevante; 

d. Crie um método para exibir as publicações de um usuário específico, 
passando como parâmetro o e-mail, e ordene as publicações também em ordem decrescente da data; 

e. Crie um método de reagir a uma PublicacaoAvancada 
e implemente a validação para que um usuário não possa interagir mais de uma vez na mesma 
publicação avançada.  
*/