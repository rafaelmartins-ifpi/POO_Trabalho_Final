import {z} from "zod";
import { TipoInteracao } from "../utils";



const idSchema = z.number();

const apelidoSchema = z.string().min(3, "O apelido de ter pelo menos 3 caracteres.");

const emailSchema = z.string().email("E-mail válido.");

const documentoSchema = z.string().min(11, "Documento inválido !! insira apenas os números.");

const conteudoSchema = z. string().min(1, "O conteúdo não pode estar vazio.");

const tipoInteracaoSchema = z.nativeEnum(TipoInteracao).refine(value => Object.values(TipoInteracao).includes(value), {
    message: "Interação inválida. Escolha uma opção disponível.",
});



export {idSchema, apelidoSchema, emailSchema, documentoSchema, conteudoSchema, tipoInteracaoSchema};