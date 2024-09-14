import { Usuario } from "./class_usuario";
import { Publicacao } from "./class_publicacao";

// REDE SOCIAL MIRC

class RedeSocial {

    private _usuarios: Usuario[];
    private _publicacoes: Publicacao[];
    private _controleIdUsuario: number;
    private _controleIdPublicacao: number;

    constructor (usuarios: Usuario[] = [], publicacoes: Publicacao [] = [], controleIdUsuario: number = 1, controleIdPublicacao: number = 1 ) {
        this._usuarios = usuarios;
        this._publicacoes = publicacoes;
        this._controleIdUsuario = controleIdUsuario;
        this._controleIdPublicacao = controleIdPublicacao;
    }

    
    get usuarios() {
        return this._usuarios
    }


    get publicacaoes() {
        return this._publicacoes;
    }


    // retorna id para cadastro de usuário e incrementa o controleIdUsuario
    criarIdUsuario() {
        return this._controleIdUsuario++;
    }


    // retorna id para cadastro de publicação e incrementa o controleIdPublicacao
    criarIdPublicacao() {
        return this._controleIdPublicacao++;
    }


    validarEmail() { // retorna true se o email for válido

    } 

}


export {RedeSocial};


/*
2) (2,5)  Crie  uma  classe  de  cadastro  chamada 
RedeSocial, onde: 
a. Exista  uma  coleção  de  usuários  outra  de 
publicações e 
Métodos de inclusão e consulta para ambas as coleções; 

b. Implemente as seguintes validações: 
i. Não  deve  ser  possível  cadastrar  usuários 
com o mesmo id e/ou e-mail;  
ii. Não deve ser possível cadastrar id; 
 
As validações devem gerar exceções que 
serão capturadas posteriormente

c. Crie um método para listar todas as 
publicações em ordem decrescente de 
acordo  com  a  data  de  criação  como  se 
fosse um feed. A listagem de publicações 
deve exibir os detalhes da publicação 
incluindo, nos casos de 
PublicacoesAvancadas,  a  quantidade  de 
reações  e  mais  algum  detalhe  que  julgar 
relevante; 
d. Crie um método para exibir as 
publicações de um usuário específico, 
passando como parâmetro o e-mail, e 
ordene as publicações também em ordem 
decrescente da data; 
e. Crie um método de reagir a uma 
PublicacaoAvancada e implemente a 
validação para que um usuário não possa 
interagir mais de uma vez na mesma 
publicação avançada.  
*/