import { RedeSocial } from "./class_redeSocial";

class App {

    rs: RedeSocial;

    constructor () {
        this.rs = new RedeSocial();
    }



    showMenu(): void {
        console.log(
            " ███╗   ███╗██╗██████╗  ██████╗\n",
            "████╗ ████║██║██╔══██╗██╔════╝\n",
            "██╔████╔██║██║██████╔╝██║     \n",
            "██║╚██╔╝██║██║██╔══██╗██║     \n",
            "██║ ╚═╝ ██║██║██║  ██║╚██████╗\n",
            "╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝"                    
        );
        console.log();
        console.log;
        console.log(
            " [1] Cadastrar Usuário          [2] xxxxxxxxxx          [3] xxxxxxxxxx\n",
            "[4] xxxxxxxxxx          [5] xxxxxxxxxx          [6] xxxxxxxxxx\n",
            "[7] xxxxxxxxxx          [8] xxxxxxxxxx          [9] xxxxxxxxxx\n",
        );
    }
    
}

