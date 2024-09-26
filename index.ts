import prompt from "prompt-sync";
import { App } from "./class/class_app";
import { RedeSocial } from "./class/class_redeSocial";
import { z } from "zod";
import { AplicationError } from "./class/class_AplicationError";
import { Usuario } from "./class/class_usuario";
import { limparTela } from "./utils";

let input = prompt();

let arquivoUsuarios: string = "./database/usuarios.csv";
let arquivoPublicacoes: string = "./database/publicacoes.csv";
let arquivoInteracoes: string = "./database/interacoes.csv";
let arquivoComentarios: string = "./database/comentarios.csv";


function main () {
    let op: string = "";
    console.log("\nInicializando MIRC - Mini Interative Rede Social\nCarregando dados...");
    let redesocial = new RedeSocial();

    try{
        redesocial.carregarDados(arquivoUsuarios, arquivoPublicacoes, arquivoInteracoes, arquivoComentarios);
    }catch(e) {
        if (e instanceof z.ZodError){
            console.log(e.errors.map(err => err.message));
        } else if ( e instanceof AplicationError)  {
            console.log(e.message);
        } else {
            console.log("Erro Desconhecido. Contate o Administrador:\n", e);
        }
    } 
    finally {
        let app: App = new App(redesocial);
        app.telaLogin();
        
        do {
            limparTela();
            app.telaPrincipal();
            op = input("Opção: ");

            switch (op) {
                case "1":
                    app.telaListarPublicacoesPorUsuario(app.currentUser);
                    break;
                case "2":
                    app.telaListarPublicacoesPorUsuario();
                    break;
                case "3":
                    app.telaListarPublicacoes();
                    break;
                case "4":
                    app.telaInserirPublicacao();
                    break;
                case "5":
                    app.telaComentar();
                    break;
                case "6":
                    app.telaInteragir();
                    break;
                case "7":
                    app.telaEditarPublicacao();
                    break;   
                case "8":
                    app.telaEditarComentario();
                    break;
                case "9":
                    app.telaListarUsusario();
                    break;
                case "10":
                    app.telaListarComentarios();
                    break;
                case "11":
                    app.telaAdministrador();
                    break;
                case "0":
                    app.telaLogin();
                    break;
                case "#":
                    app.redesocial.salvarDados(arquivoUsuarios, arquivoPublicacoes, arquivoInteracoes, arquivoComentarios);
                    console.log();
                    console.log("Salvando dados...");
                    break;
                default:
                    input("\nOpção Inválida. \n [enter]");
                    break;
            }

        } while (op !== "#");
    }
    
    console.log();    
    console.log("\nAplicação encerrada !! \n");
}


main();