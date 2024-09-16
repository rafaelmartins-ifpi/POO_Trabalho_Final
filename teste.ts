import prompt from "prompt-sync";
const { exec } = require('child_process');
let input = prompt();

enum TipoInteracao {
    Like = "like",
    Dislike = "dislike",
    Riso = "riso",
    Aplauso = "aplauso",
    Amor = "amor"
};

function emitirBeep(): void {
    exec('beep', (error:any) => {
        if (error) {
            console.error(`Erro ao executar o comando beep: ${error.message}`);
            return;
        }
        console.log('Beep emitido.');
    });
}

let tipo: string = TipoInteracao.Like;
console.log(`tipo : ${typeof(tipo)} \ntipo: ${tipo}`);

input("enter");
process.stdout.write('\x07');
emitirBeep();
let reacao = tipo;
console.log(`reacao : ${typeof(reacao)} \ntipo: ${reacao}`);
