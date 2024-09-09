
class Usuario {

    private _id: number;
    private _apelido: string;
    private _email: string;
    private _documento: string;

    constructor (id: number, apelido: string, email: string, documento: string) {
        this._id = id;
        this._apelido = apelido;
        this._email = email;
        this._documento = documento;
    }

    get id() {
        return this._id;
    }

    get apelido() {
        return this._apelido;
    }

    get email() {
        return this._email;
    }

    get documento() {
        return this._documento;
    }

};


export {Usuario};