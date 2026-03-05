/* 


--- INICIAR O PROGRAMA ( CRIAR E CARREGAR  A DATA ) ---


se usuario == usuario_web (1-luan){

    na tabela "user_config" se existe id(objeto){
        pegar o id(objeto) <---
        entrar na tabela "categories"


        carregar os dados (id(objeto))
        aparecer na tela(id(objeto)) vai ser chamado 
        

    } se nao existir id(objeto){
        criar na tabela "categories" com o nome == mes atual, cor == green e parent_id == null
        pegar o data[0].id (o id do objeto que foi criado)
        e vai criar na tabela "user_config" com o id(obejeto) == data[0].id (mesmo id da outra tabela)c
                ----> categories:

                        id(objeto)  |   id_user  |   nome   |   color   |   parent_id
                        
                            1       |   1-luan   |fevereiro |   green   |   null
                            2       |   2-duda   |  julho   |   green   |   null
                
                ----> user_config:

                        id(objeto)  |   id_user  |   nome   |   color   |   parent_id
                        
                            2       |   2-duda   |  julho   |   green   |   null
                            1       |   1-luan   |fevereiro |   green   |   null
        depois vai voltar e verificar dnv


    }
} se o usuario for diferente do usuario_web{
    return
}



lista_categorias = []
--- CARREGAR DADOS ---
function montarArvore(lista_categorias, parentId = null) {
  return lista
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      ...item,
      filhos: montarArvore(lista, item.id)
    }))
}


me explique parte por parte desse ccodigo


--- ADICIONAR COLUNA/SUBCOLUNA ---





--- MES PARA CATEGORIA 1 ---

categories:

            id(objeto)  |   id_user  |   nome    |   color   |   parent_id

         --->   1       |   1-luan   | fevereiro |   green   |   null
                2       |   1-luan   |categoria 1|    red    |    1  <---


user_config:

            id(objeto)  |   id_user  |   nome   |   color   |   parent_id
            
                2       |   2-duda   |  julho   |   green   |   null
        --->    1       |   1-luan   |fevereiro |   green   |   null



--- CATEGORIA 1 PARA CATEGORIA 2... ---

categories:

            id(objeto)  |   id_user  |   nome    |   color   |   parent_id

                1       |   1-luan   | fevereiro |   green   |   null
         --->   2       |   1-luan   |categoria 1|    red    |    1  
                3       |   2-duda   |   julho   |   green   |   null       --> usuario != usuario_web
                4       |   1-luan   |categoria 2|    red    |    2  <---
                                    ... 



user_config:

            id(objeto)  |   id_user  |   nome   |   color   |   parent_id
            
                3       |   2-duda   |  julho   |   green   |   null
                1       |   1-luan   |fevereiro |   green   |   null

*/



// -- INICIO 
let id_geral = 5;
const ROW_HEIGHT = 72;

//ista inicial
let lista = [
  { id: 1, categoria: 0, color: "green", parent_id: null },
  { id: 2, categoria: 1, color: "red", parent_id: 1 },
  { id: 3, categoria: 2, color: "red", parent_id: 2 },
  { id: 4, categoria: 1, color: "blue", parent_id: 1 },
  { id: 5, categoria: 3, color: "red", parent_id: 3 }
];


function montarArvore(lista, parentId = null, seen = new Set()) {
  return lista
    .filter(item => item.parent_id == parentId && !seen.has(item.id))
    .map(item => {
      seen.add(item.id);
      let filhos = montarArvore(lista, item.id, seen);
      return { ...item, filhos };
    });
}


let arvore = montarArvore(lista);
console.log(arvore);

function criarItens(arvore) {
  calcularLayout(arvore);
  const itens = achatarArvore(arvore).sort((a, b) => a.y - b.y);

  let maxY = 0;

  itens.forEach(item => {
    let col = document.getElementById("coluna_" + item.categoria);
    let div = document.createElement("div");
    div.id = `id_${item.id}_cat_${item.categoria}_parent_${item.parent_id}_color_${item.color}`;
    div.className = "item_" + item.categoria;
    div.style.background = item.color;
    div.textContent = item.id;

    if (item.categoria > 0) {
      div.style.top = `${item.y * ROW_HEIGHT}px`;
      maxY = Math.max(maxY, item.y);
    }

    if (item.categoria != 3) {
      let mais = document.createElement("button");
      mais.id = "mais-" + div.id;
      mais.style.width = "15px";
      mais.textContent = "+";
      mais.style.marginLeft = "auto";
      mais.style.cursor = "pointer";
      mais.addEventListener("click", () => addList(div.id));

      div.appendChild(mais);
    }

    col.appendChild(div);
  });

  const alturaColunas = `${(Math.ceil(maxY) + 1) * ROW_HEIGHT + 20}px`;
  document.querySelector(".container").style.minHeight = alturaColunas;
  document.querySelectorAll("#coluna_1, #coluna_2, #coluna_3").forEach(col => {
    col.style.height = alturaColunas;
  });
}
function calcularLayout(arvore) {
  let proximaFolha = 0;

  function definirY(item) {
    if (!item.filhos || item.filhos.length === 0) {
      item.y = proximaFolha;
      proximaFolha += 1;
      return item.y;
    }

    item.filhos.forEach(definirY);
    item.y = (item.filhos[0].y + item.filhos[item.filhos.length - 1].y) / 2;
    return item.y;
  }

  arvore.forEach(definirY);
}
function achatarArvore(arvore, itens = []) {
  arvore.forEach(item => {
    itens.push(item);
    if (item.filhos && item.filhos.length > 0) {
      achatarArvore(item.filhos, itens);
    }
  });

  return itens;
}
criarItens(arvore);




//-- BOTAO + 

function addList(id_co) {
  let codificar = id_co.split("_");
  let id = codificar[1];
  let cat = parseInt(codificar[3]);
  let parent_id = codificar[5];
  let color = codificar[7];

  console.log(`id ${id} - cat ${cat} - parent ${parent_id}`);
  id_geral += 1;

  lista.push({
    id: id_geral,
    categoria: cat + 1,
    color: color,
    parent_id: id
  });

  arvore = montarArvore(lista);
  console.log(lista);

  limparTela();
  criarItens(arvore);
}

function limparTela() {
  document.querySelectorAll(".coluna").forEach(col => {
    col.innerHTML = "";
  });
}

