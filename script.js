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
let id_geral = 0;

function montarArvore(lista_categorias, parentId = null, seen = new Set()) {
  return lista_categorias
    .filter(item => item.parent_id === parentId && !seen.has(item.id))
    .map(item => {
      seen.add(item.id);
      let filhos = montarArvore(lista_categorias, item.id, seen);
      return { ...item, filhos };
    });
}

// Lista inicial
let lista = [
  { id: 1, categoria: 0, color: "green", parent_id: null }
];

let arvore = montarArvore(lista);

// Mostra a árvore na tela
function mostrarTela(arvore) {
  for (let i = 0; i < 4; i++) {
    let col = document.getElementById("coluna_" + i);
    if (col) col.innerHTML = "";
  }

  function percorrer(lista, nivel = 0) {
    for (let item of lista) {
      let coluna = document.getElementById("coluna_" + nivel);
      if (coluna) {
        let div = document.createElement("div");
        div.id = `parent_${item.parent_id}_nivel_${nivel}_item_${item.id}`;
        div.innerText = "ID: " + item.id;
        div.style.marginBottom = "10px";
        div.style.padding = "5px";
        div.style.border = "1px solid black";
        div.style.color = "white";
        div.style.borderRadius = "10px";
        div.style.background = item.color;
        div.style.display = "flex";
        div.style.alignItems = "center";

        // Botão para adicionar filhos
        if (nivel !== 3) {
          let mais = document.createElement("button");
          mais.innerText = "+";
          mais.style.fontSize = "16px";
          mais.style.padding = "0px 4px";
          mais.style.background = "white";
          mais.style.marginLeft = "auto";

          mais.addEventListener("click", () => mostrarInput(div.id));
          div.appendChild(mais);
        }

        coluna.appendChild(div);
      }

      if (item.filhos.length > 0) percorrer(item.filhos, nivel + 1);
    }
  }

  percorrer(arvore);
}

// Mostra o input para adicionar novos itens
function mostrarInput(parentId) {
  if (document.getElementById("input_" + parentId)) return;

  let input = document.createElement("div");
  input.id = "input_" + parentId;
  input.innerHTML = `
    <input type="color" id="color_${parentId}" value="#097811">
    <input type="text" id="name_${parentId}" placeholder="Nome">
    <input type="button" value=">>" id="btn_${parentId}">
  `;

  document.querySelector(".botoes").appendChild(input);

  // Adiciona evento ao botão
  document.getElementById(`btn_${parentId}`).addEventListener("click", () => {
    addItens(parentId, input);
  });
}

// Adiciona novo item na lista e atualiza a tela
function addItens(parentId, inputDiv) {
  if (!inputDiv) return;

  let colorInput = inputDiv.querySelector(`input[type="color"]`);
  let nameInput = inputDiv.querySelector(`input[type="text"]`);

  let color = colorInput ? colorInput.value : "#000000";
  let name = nameInput ? nameInput.value : "";

  id_geral += 1;

  // Descobre o nível do pai
  let codificar = parentId.split("_");
  let nivelPai = parseInt(codificar[3]);
  let nivel = nivelPai + 1;

  let paiId = parseInt(codificar[5]);
  let novoId = id_geral + 1;

  if (paiId === novoId) {
    console.error("Não pode adicionar item como filho de si mesmo");
    return;
  }

  // Se for nível > 1, herda cor do antecessor
  if (nivel > 1) {
    let antepassado = lista.find(item => item.id === paiId && (item.categoria === 1 || item.categoria === 2));
    if (antepassado) color = antepassado.color;
  }

  let novoItem = {
    id: id_geral,
    categoria: nivel,
    color: color,
    parent_id: paiId,
    name: name
  };

  lista.push(novoItem);

  // Remove input
  inputDiv.remove();

  // Reconstrói a árvore
  arvore = montarArvore(lista);
  mostrarTela(arvore);
}

// Inicializa a tela
mostrarTela(arvore);