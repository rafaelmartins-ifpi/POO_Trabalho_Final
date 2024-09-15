import prompt from "prompt-sync";
import { App } from "./class/class_app";
import { RedeSocial } from "./class/class_redeSocial";


let input = prompt();
let redesocial = new RedeSocial();
let app: App = new App(redesocial);


function main () {
    let op: string = "";
    
    do {
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
            case "0":
                break;
            default:
                input("\nOpção Inválida !! \n [enter]");
                break;
        }

    } while (op != "0");
    console.log("\nAplicação encerrada !! \n");

}


main();