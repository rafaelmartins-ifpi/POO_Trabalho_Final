import {z} from "zod";
import { TipoInteracao } from "../types";



const idSchema = z.number();

const apelidoSchema = z.string().min(3, {message: "O apelido de ter pelo menos 3 caracteres."});

const emailSchema = z.string().email({message: "E-mail válido."});

const documentoSchema = z.string().length(11, {message: "CPF inválido !! insira apenas os 11 números."}).regex(/^\d{11}$/, {message: "CPF inválido !! insira apenas os números."});

const conteudoSchema = z. string().min(1, {message: "O conteúdo não pode estar vazio."});

const tipoInteracaoSchema = z.nativeEnum(TipoInteracao).refine(value => Object.values(TipoInteracao).includes(value), {
    message: "Interação inválida. Escolha uma opção disponível.",
});



export {idSchema, apelidoSchema, emailSchema, documentoSchema, conteudoSchema, tipoInteracaoSchema};