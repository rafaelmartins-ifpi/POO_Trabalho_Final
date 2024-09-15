enum TipoInteracao {
    Like = "like",
    Dislike = "dislike",
    Riso = "riso",
    Aplauso = "aplauso",
    Amor = "amor"
};

let tipo: string = TipoInteracao.Like;
console.log(`tipo : ${typeof(tipo)} \ntipo: ${tipo}`);

let reacao = tipo;
console.log(`reacao : ${typeof(reacao)} \ntipo: ${reacao}`);