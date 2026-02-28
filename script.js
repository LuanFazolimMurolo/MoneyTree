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



let id_geral = 0

function montarArvore(lista_categorias, parentId = null) {
    return lista_categorias
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        ...item,
        filhos: montarArvore(lista_categorias, item.id)
      }))
  }

function limitarNivel(arvore, nivelMaximo, nivelAtual = 0) {
  
  return arvore.map(item => ({
    ...item,
    filhos:
      nivelAtual < nivelMaximo
        ? limitarNivel(item.filhos, nivelMaximo, nivelAtual + 1)
        : []
  }))
}


  
let lista = [
  { id: 1, categoria:0,color:"green", parent_id: null },
  { id: 2, categoria:1,color:"red",parent_id: 1 },
  { id: 3, categoria:1,color:"blue",parent_id: 1},
  { id: 4, categoria:2,color:"red",parent_id: 2 },
  { id: 5, categoria:2,color:"red",parent_id: 2 },
  { id: 6, categoria:3,color:"blue",parent_id: 3 },
  { id: 7, categoria:3,color:"red",parent_id: 4 }
]

let arvore = montarArvore(lista)



function mostrarTela(arvore) {

    // limpa colunas
    for (let i = 1; i < 4; i++) {
        let col = document.getElementById("coluna_" + i)
        if (col) col.innerHTML = ""
    }

    function percorrer(lista, nivel = 0) {

        for (let item of lista) {

            let coluna = document.getElementById("coluna_" + nivel)

            if (coluna) {
              let div = document.createElement("div")
              div.id = `parent_${item.parent_id}_nivel_${nivel}_item_${item.id}`
              div.innerText = "ID: " + item.id
              div.style.marginBottom = "10px"
              div.style.padding = "5px"
              div.style.border = "1px solid black"
              div.style.color = "white"
              div.style.borderRadius = "10px"
              div.style.background = item.color
              div.style.display = "flex"
              
              if (nivel !== 3){
                let mais = document.createElement("button") 
                mais.id = `mais_parent_${item.parent_id}_nivel_${nivel}_item_${item.id}`
                mais.innerText = "+"
                mais.style.fontSize = "16px"
                mais.style.padding = "0px 4px"
                mais.style.background = "white"
                mais.style.marginLeft = "auto"
                mais.addEventListener("click",() => additens(`mais_parent_${item.parent_id}_nivel_${nivel}_item_${item.id}`))
                div.appendChild(mais)
              }


              coluna.appendChild(div)
              

   
            }

            if (item.filhos.length > 0) {
                percorrer(item.filhos, nivel + 1)
            }
        }
    }

    percorrer(arvore)
}

async function carregarDados() {
    /*const { data, error } = await supabase
      .from('categorias') // nome da sua tabela
      .select('*')

    if (error) {
      console.error('Erro ao buscar dados:', error)
      return
    }*/
   
    /*let arvoreFiltrada = limitarNivel(arvore, 1)
    document.getElementById("res").innerHTML =
    `<pre>${JSON.stringify(arvoreFiltrada, null, 2)}</pre>`*/
    mostrarTela(arvore)

    
   

}



function additens(codig){
    console.log(codig)
    let color = document.getElementById("color").value
    let name = document.getElementById("name").value
    id_geral +=1
    lista.push({
      id: id_geral,

    })
    console.log(`${color} ${name}`)
}

carregarDados()