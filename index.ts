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
                //loppFunction (incluirPostagem, "Deseja incluir outra Postagem ?");
                break;
            case "4":
                //loppFunction (consultarPostagens, "Deseja consultar outra Postagem ?");
                break;
            case "5":
                //loppFunction (curtir, "Deseja curtir outra postagem ?");
                break;
            case "6":
                //loppFunction(descurtir, "Deseja descurtir outra mensagem ?");
                break;
            case "7": 
                //loppFunction(decrementarVisualizacoes, "Deseja Decrementar Visualização de outra Postagem Especial ?");
                break;
            case "8":
                //loppFunction(exibirPostagem, "Deseja realizar nova exibição ?");
                break;
            case "9":
                //loppFunction(postagensPopulares, "Deseja exibir novamente ?");
                break;
            case "10":
                //loppFunction(hashtagsPopulares, "Deseja exibir novamente ?");
                break;
            case "0":
                break;
            default:
                input("\nOpção Inválida !! \n [enter]");
                break;
        }

    } while (op != "0");
    input("\nAplicação encerrada !! \n[enter]")

}


main();