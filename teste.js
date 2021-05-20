import tools from './index.js';

const list = [1, 2, 3, 4, 5];
console.log("Iniciando a lista");
await list.forEachAsync(async(item, index) => {
    console.log(`    ${index} - ${item}`);
});
console.log("Terminou de passar a lista");
await tools.init();