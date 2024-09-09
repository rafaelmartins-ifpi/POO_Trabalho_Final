import prompt from 'prompt-sync';
import {format} from 'date-fns';

let input = prompt();


// let data = format(new Date(),'dd/mm/yyyy');
// let hora = format(new Date(), 'hh:mm:ss');

// console.log(`Data: ${data}  (${typeof(data)})`);
// console.log(`Hora: ${hora}  (${typeof(hora)})`);


let data1 = new Date();
console.log(`Data1: ${data1}  - Tipo: ${typeof(data1)}`);
let a = input("");
console.log();

let data2 = new Date();
console.log(`Data2: ${data2}  - Tipo: ${typeof(data2)}`);
console.log();

console.log(`Data1 < Data2: ${data1 < data2}`);
console.log(`Data1 = Data2: ${data1 == data2}`);
console.log(`Data1 > Data2: ${data1 > data2}`);