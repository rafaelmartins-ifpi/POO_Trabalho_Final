import { RedeSocial } from "./class_redeSocial";
import prompt from 'prompt-sync';
import { Usuario } from "./class_usuario";
import {z} from "zod";
import { apelidoSchema, documentoSchema, emailSchema, idSchema } from "../zod_schemas/zodSchemas";
import { AplicationError } from "./class_AplicationError";

class App {

    private _logo: string;
    private _redesocial: RedeSocial;
    private _input = prompt();

    constructor (redesocial: RedeSocial) {
        this._redesocial = redesocial;
        this._logo = "███╗   ███╗██╗██████╗  ██████╗\n"+
        "████╗ ████║██║██╔══██╗██╔════╝\n"+
        "██╔████╔██║██║██████╔╝██║     \n"+
        "██║╚██╔╝██║██║██╔══██╗██║     \n"+
        "██║ ╚═╝ ██║██║██║  ██║╚██████╗\n"+
        "╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝"          
    }


    telaPrincipal(): void {
        console.clear();
        console.log();
        console.log(this._logo);
        
        console.log();
        console.log();
        console.log(
            " [1] Cadastrar Usuário          [2] Listar Usuarios          [3] xxxxxxxxxx\n",
            "[4] xxxxxxxxxx          [5] xxxxxxxxxx          [6] xxxxxxxxxx\n",
            "[7] xxxxxxxxxx          [8] xxxxxxxxxx          [9] xxxxxxxxxx\n",
        );
    }

    telaCadastrarUsuario(): void {
        let repetir: string = "";
        
        do {
            try {

                console.clear();
                console.log("CADASTRO DE NOVO USUÁRIO !!");
                console.log();
    
                console.log("insira os dados solicitados abaixo");
                console.log();
            
                const apelido: string = this._input("Apelido: ");
                apelidoSchema.parse(apelido);
                
                const email: string = this._input("E-mail: ");
                emailSchema.parse(email);
                
                const documento: string = this._input("Documento (CPF): ");
                documentoSchema.parse(documento);
                
                const id: number = this._redesocial.controleIdUsuario;
    
                console.log();
    
                const usuario:Usuario = new Usuario(id, apelido.toLowerCase(), email.toLowerCase(), documento);
    
                this._redesocial.adicionarUsuario(usuario);
    
                console.log("Usuário cadastrado");
                
    
            } catch (e: any) {
                if (e instanceof z.ZodError){
                    console.log(e.errors[0].message);
                } else if ( e instanceof AplicationError)  {
                    console.log(e.message);
                } else {
                    console.log("Erro Desconhecido. Contate o Administrador\n", e);
                }
            }

            console.log();
            repetir = this._input("Cadastrar novo Usuário? [s/n]: ");

        } while (repetir.toLowerCase() === 's');
    }

    TelaListarUsusario (): void {

        let repetir: string = "";

        do {

            try{
                console.clear();
                console.log("LISTAGEM DE USUÁRIOS");
                console.log();
    
                this._redesocial.listarUsuarios();

            }catch(e){
                if (e instanceof z.ZodError){
                    console.log(e.errors[0].message);
                } else if ( e instanceof AplicationError)  {
                    console.log(e.message);
                } else {
                    console.log("Erro Desconhecido. Contate o Administrador\n", e);
                }
            }
            
            console.log();
            repetir = this._input("Listar novamente? [s/n]: ");

        } while (repetir.toLowerCase() ==="s");

    }
    
}

export {App}
