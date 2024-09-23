import prompt from "prompt-sync";
import { App } from "./class/class_app";
import { RedeSocial } from "./class/class_redeSocial";
import { z } from "zod";
import { AplicationError } from "./class/class_AplicationError";

let input = prompt();

let arquivoUsuarios: string = "./database/usuarios.csv";
let arquivoPublicacoes: string = "./database/publicacoes.csv";
let arquivoInteracoes: string = "./database/interacoes.csv";


function main () {
    let op: string = "";
    console.log("\nInicializando MIRC - Mini Interative Rede Social\nCarregando dados...");
    let redesocial = new RedeSocial();

    try{
        redesocial.carregarDados(arquivoUsuarios, arquivoPublicacoes, arquivoInteracoes);
    }catch(e) {
        if (e instanceof z.ZodError){
            //console.log(e.errors[0].message);
            console.log(e.errors.map(err => err.message));
        } else if ( e instanceof AplicationError)  {
            console.log(e.message);
        } else {
            console.log("Erro Desconhecido. Contate o Administrador:\n", e);
        }
    } 
    finally {
        do {
            let app: App = new App(redesocial);
            app.telaPrincipal();
            op = input("Opção: ");

            switch (op) {
                case "1":
                    app.telaCadastrarUsuario();
                    break;
                case "2":
                    app.TelaListarUsusario();
                    break;
                case "3":
                    app.telaInserirPublicacao();
                    break;
                case "4":
                    app.telaListarPublicacoes();
                    break;
                case "5":
                    app.telaInteragir();
                    break;
                case "6":
                    app.telaListarPublicacoesPorUsuario();
                    break;
                case "7":
                    app.telaEditarPublicacao();
                    break;   
                case "8":
                    console.log(`Controle IdUsuário: ${redesocial.controleIdUsuario}`);
                    console.log(`Controle IdPublicação: ${redesocial.controleIdPublicacao}`);
                    console.log(`Controle IdInteracao: ${redesocial.controleIdInteracao}`);
                    input("\n[enter]");
                    break;
                case "0":
                    app.redesocial.salvarDados(arquivoUsuarios, arquivoPublicacoes, arquivoInteracoes);
                    console.log();
                    console.log("Salvando dados...");
                    break;
                default:
                    input("\nOpção Inválida. \n [enter]");
                    break;
            }

        } while (op != "0");
    }
    
    console.log();    
    console.log("\nAplicação encerrada !! \n");
}


main();