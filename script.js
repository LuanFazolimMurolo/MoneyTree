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

              id(objeto)  |   id_user  |   categoria    |   color   |   parent_id

          --->   1       |   1-luan   |       0        |   green   |   null
                  2       |   1-luan   |       1        |    red    |    1  <---






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
  const SVG_NS = "http://www.w3.org/2000/svg";
  let ligacoesRenderizadas = new Set();
  const tema_black = "#000000"
  const tema_soft_dark ="#2a2a2a"
  const tema_soft_light = "#c5c5c5"
  const tema_white = "#ffffff"
  const tema_cores = [
    tema_black,
    tema_soft_dark,  
    tema_soft_light,
    tema_white
  ]

  let cor_atual = tema_soft_light
  let tema_atual = cor_atual
  let cor_topo 
  let cor_topo_2
  const lista_tema = document.getElementById("cores_lista")
  const atual_tema = document.getElementById("cor_atual")






  // lista inicial
  let lista = [
    { id: 1, categoria: 0, color: "#b3ff03", parent_id: null, nome: "Março",text_color: "#578d00", valor: 0}/*,
    { id: 2, categoria: 1, color: "red", parent_id: 1, nome: "Lazer"},
    { id: 3, categoria: 2, color: "red", parent_id: 2, nome: "Shows"},
    { id: 4, categoria: 1, color: "blue", parent_id: 1, nome: "Dispezas"},
    { id: 5, categoria: 3, color: "red", parent_id: 3, nome: "show 1" }*/
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
  arvore.forEach(raiz=>{
    calcularSomas(raiz)
  })
  console.log(arvore);
function calcularSomas(item){

    if(!item.filhos || item.filhos.length === 0){
      return item.valor || 0
    }

    let soma = 0

    item.filhos.forEach(filho=>{
      soma += calcularSomas(filho)
    })

    item.valor = soma
    return soma
}

  function criarItens(arvore) {
    calcularLayout(arvore);
    const itens = achatarArvore(arvore).sort((a, b) => a.y - b.y);

    let maxY = 0;

    itens.forEach(item => {
      let col = document.getElementById("coluna_" + item.categoria);
      let div = document.createElement("div");
      div.id = `id_${item.id}_cat_${item.categoria}_parent_${item.parent_id}_color_${item.color}_text-color_${item.text_color}_nome_${item.nome}`;
      div.className = "item_" + item.categoria;
      div.style.color = item.text_color
      div.style.background = item.color
      let texto = document.createElement("span")
      texto.className = "texto_item"
      texto.textContent = item.nome
    
      col.appendChild(div);


      div.appendChild(texto)    

      if (item.categoria > 0) {
        div.style.top = `${item.y * ROW_HEIGHT}px`;
        maxY = Math.max(maxY, item.y);
      }else{
        cor_topo = item.color
        cor_topo_2 = item.text_color
      }

     
      
      
      let div_botoes = document.createElement("div")
      div_botoes.style.display = "flex"
      div_botoes.style.gap = "5px"
      div_botoes.style.marginLeft = "auto"
      div_botoes.style.paddingRight = "20px"

      div.appendChild(div_botoes)
      

      let edit = document.createElement("button")
      //edit.style.background =
      edit.id = "edit-" + div.id; 
      edit.style.width ="35px"
      edit.textContent = "edit"
      edit.addEventListener("click", () => Hud_addList(edit.id));

      div_botoes.appendChild(edit);

      if (item.categoria != 3) {
        let mais = document.createElement("button");
        mais.id = "mais-" + div.id;
        mais.style.width = "15px";
        mais.textContent = "+";
        mais.style.marginLeft = "auto";
        mais.style.cursor = "pointer";
        mais.addEventListener("click", () => Hud_addList(mais.id));

        div_botoes.appendChild(mais);
      }




    });



    const alturaColunas = `${(Math.ceil(maxY) + 1) * ROW_HEIGHT + 20}px`;
    document.querySelector(".container").style.minHeight = alturaColunas;
    document.querySelectorAll("#coluna_1, #coluna_2, #coluna_3").forEach(col => {
      col.style.height = alturaColunas;
    });

    desenharLigacoes();
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


  // -- BOTAO +
  function addList(id_co,color_inp,nome_inp,text_color_inp) {
    
    console.log(nome_inp+ color_inp)
    let codificar_ed_ma = id_co.split("-")
    let ed_ma = codificar_ed_ma[0]
    let codificar = id_co.split("_");
    let id = codificar[1];
    let cat = parseInt(codificar[3]);
    let parent_id = codificar[5];
    let color = codificar[7];
    if (cat === 0){
      color = color_inp
    }

    console.log(`id ${id} - cat ${cat} - parent ${parent_id}`);
    id_geral += 1;
    if (ed_ma === "mais"){
      lista.push({  
        id: id_geral,
        categoria: cat + 1,
        color: color,
        parent_id: id,
        nome:nome_inp,
        text_color:text_color_inp
      });
      }else{

  let item = lista.find(i => i.id == id)

  let descendentes = pegarDescendentes(id)

  // atualiza o item editado
  item.nome = nome_inp
  item.color = color_inp
  item.text_color = text_color_inp

  if (cat > 0){

    // atualiza todos os filhos
    descendentes.forEach(filho => {
      filho.color = color_inp
      filho.text_color = text_color_inp
    })

  }else{

    // categoria 0 (topo)
    cor_topo = color_inp
    cor_topo_2 = text_color_inp

    // atualiza visual do seletor de cores
    document.querySelectorAll(".cor_item").forEach(el => {
       el.style.border = `5px solid ${cor_topo}`
      el.style.boxShadow = `1px 1px ${cor_topo_2}`
    })

    }

  }
      function pegarDescendentes(idPai){
        let filhos = lista.filter(i => i.parent_id == idPai)

        filhos.forEach(filho => {
          filhos = filhos.concat(pegarDescendentes(filho.id))
        })

        return filhos
      }
    arvore = montarArvore(lista);
 
    console.log(lista);

    limparTela();
    Delet_hud_addList();
    criarItens(arvore);
  }

  function limparTela() {
    document.querySelectorAll(".coluna").forEach(col => {
      col.innerHTML = "";
    });
  }

  function Hud_addList(id_co){
      let codificar = id_co.split("_");
      let codificar_ed_ma = id_co.split("-")
      let ed_ma = codificar_ed_ma[0]
      let cat = parseInt(codificar[3]);
      let color = codificar[7];
      let text_color = codificar[9]
      let nome = codificar[11]

      if(document.getElementById("overlay_hud_addList")) return;
      let div = document.createElement("div")
      div.className = "hidden_hud_addList"
      div.id = "overlay_hud_addList"

      // hud
      let div_hud = document.createElement("div")
      div_hud.id = "hud_addList"


      //botao delet
      let btn_delet = document.createElement("button")
      btn_delet.textContent = "X"
      btn_delet.id = "delet_hud_addList"
      btn_delet.addEventListener("click", () => Delet_hud_addList());
      
      //previa
      let div_previa = document.createElement("div")
      div_previa.id = "previa_hud_addList"
      div_previa.style.background = color
      div_previa.style.color = text_color
      let texto_previa = document.createElement("span")
      texto_previa.id = "texto_previa"

      texto_previa.textContent = "Abc123"
      if (ed_ma === "edit"){
          texto_previa.textContent = nome

      }
      div_previa.appendChild(texto_previa)
      //input color
      let btn_color = document.createElement("input")
      btn_color.type = "color"

      btn_color.addEventListener("input", () => {
      let cor = btn_color.value
      div_previa.style.background = cor})

      btn_color.id = "color_hud_addList"
      btn_color.value = color



      //input color_text
      let btn_text_color = document.createElement("input")
      btn_text_color.type = "color"
      btn_text_color.addEventListener("input", () => {
      let cor = btn_text_color.value
      div_previa.style.color = cor})

      btn_text_color.id = "text_color_hud_addList"
      btn_text_color.value = text_color
      
      if ((cat > 0 && ed_ma === "mais") || (cat > 1 && ed_ma === "edit")){
        btn_color.disabled = true
        btn_text_color.disabled = true

        btn_color.style.cursor = "not-allowed"
        btn_text_color.style.cursor = "not-allowed"

        btn_color.style.opacity = "0"
        btn_text_color.style.opacity = "0"

      }
      //input nome
      let btn_nome = document.createElement("input")
      btn_nome.type = "text"
      if (ed_ma === "edit"){
            btn_nome.value = nome
      }
      btn_nome.addEventListener("input", () => {
      let texto = btn_nome.value
      texto_previa.textContent = texto})

      btn_nome.id = "nome_hud_addList"
      
      //input confirm
      let btn_confirm = document.createElement("button")
      btn_confirm.id = "confirm_hud_addList"
      btn_confirm.textContent =">>"
      btn_confirm.addEventListener("click", () => addList(id_co, btn_color.value, btn_nome.value, btn_text_color.value));
      
      div_hud.addEventListener("keydown", (e) => {

        if(e.key === "Enter"){
            addList(id_co, btn_color.value, btn_nome.value, btn_text_color.value)
        }
        })
      
      //input valor
      let campo_valor = document.createElement("div")
      campo_valor.className = "campo_valor"
      campo_valor.style.display = "flex"
      campo_valor.style.alignItems = "center"
      let valor = document.createElement("input")
      valor.className = "valor"
      valor.type = "text"

      let moeda = document.createElement("span")
      moeda.textContent = "R$"
      

      campo_valor.appendChild(moeda)
      campo_valor.appendChild(valor)


    


      document.body.appendChild(div)
      div.appendChild(div_hud)
      div_hud.appendChild(btn_delet)
      div_hud.appendChild(btn_color)
      div_hud.appendChild(btn_text_color)

      div_hud.appendChild(btn_nome)
      div_hud.appendChild(btn_confirm)
      
      div_hud.appendChild(campo_valor)

      div_hud.appendChild(div_previa)





  }
  function Delet_hud_addList(){
    const overlay = document.getElementById("overlay_hud_addList")

    overlay.remove()
  }

  criarItens(arvore);


  // --- TOPO FUNDO
  function corContraste(hex) {

    hex = hex.replace("#","")

    let r = parseInt(hex.substring(0,2),16)
    let g = parseInt(hex.substring(2,4),16)
    let b = parseInt(hex.substring(4,6),16)

    // fórmula de luminosidade
    let luminosidade = (0.299*r + 0.587*g + 0.114*b)

    if(luminosidade > 186){
        return "#000000" // fundo claro → texto preto
    }else{
        return "#ffffff" // fundo escuro → texto branco
    }

  }

  tema_cores.forEach(cor => {
      const item = document.createElement("div")
      item.className = "cor_item"
      item.style.background = cor
      item.style.border = `5px solid ${cor_topo}`
      item.style.boxShadow = `1.5px 1.5px ${cor_topo_2}`
      item.style.color = corContraste(cor)
      if (cor == cor_atual){
        item.textContent = "X"
      }

      item.addEventListener("click", () => {
          // remove X de todos
          document.querySelectorAll(".cor_item").forEach(el=>{
              el.textContent = ""
          })

          // coloca X no selecionado
          item.textContent = "X"


          cor_atual = cor
          selecionarCor(cor)
          let body = document.body
          body.style.background = cor_atual 

      })

      lista_tema.appendChild(item)

  })

  function selecionarCor(cor){
      console.log("cor escolhida:", cor)
  }




  // -- LINHAS  

  function garantirLayerLigacoes() {
    let layer = document.getElementById("connections-layer");

    if (!layer) {
      layer = document.createElementNS(SVG_NS, "svg");
      layer.id = "connections-layer";
      document.body.appendChild(layer);
    }

    layer.setAttribute("width", String(document.documentElement.scrollWidth));
    layer.setAttribute("height", String(document.documentElement.scrollHeight));

    return layer;
  }

  function centroVertical(el) {
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY + rect.height / 2;
  }

  function bordaDireita(el) {
    const rect = el.getBoundingClientRect();
    return rect.right + window.scrollX;
  }

  function bordaEsquerda(el) {
    const rect = el.getBoundingClientRect();
    return rect.left + window.scrollX;
  }

  function criarPathCurvo(x1, y1, x2, y2) {
    const distancia = Math.max(45, (x2 - x1) * 0.5);
    const c1x = x1 + distancia;
    const c1y = y1 + (y2 - y1) * 0.08;
    const c2x = x2 - distancia;
    const c2y = y2 - (y2 - y1) * 0.08;

    return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  }

  function animarCaminho(path, duracao = 520) {
    const comprimento = path.getTotalLength();
    path.setAttribute("stroke-dasharray", String(comprimento));
    path.setAttribute("stroke-dashoffset", String(comprimento));

    if (typeof path.animate === "function") {
      path.animate(
        [
          { strokeDashoffset: comprimento },
          { strokeDashoffset: 0 }
        ],
        {
          duration: duracao,
          easing: "ease-out",
          fill: "forwards"
        }
      );
      return;
    }

    // Fallback para navegadores sem WAAPI.
    path.style.transition = "none";
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${duracao}ms ease-out`;
    path.setAttribute("stroke-dashoffset", "0");
  }

  function desenharLigacoes() {
    const layer = garantirLayerLigacoes();
    layer.innerHTML = "";
    const novasLigacoes = new Set();

    const itensMap = new Map();
    document.querySelectorAll("[id^='id_']").forEach(el => {
      const partes = el.id.split("_");
      const id = Number(partes[1]);
      itensMap.set(id, el);
    });

    lista.forEach(item => {
      if (!item.parent_id) {
        return;
      }

      const parentData = lista.find(node => Number(node.id) === Number(item.parent_id));
      if (parentData && Number(parentData.categoria) === 0 && Number(item.categoria) === 1) {
        return;
      }

      const parentEl = itensMap.get(Number(item.parent_id));
      const filhoEl = itensMap.get(Number(item.id));

      if (!parentEl || !filhoEl) {
        return;
      }

      const chaveLigacao = `${item.parent_id}->${item.id}`;
      novasLigacoes.add(chaveLigacao);

      const corParent = parentEl.style.background || window.getComputedStyle(parentEl).backgroundColor;
      const corTexto = parentEl.style.color || window.getComputedStyle(parentEl).color;

      const x1 = bordaDireita(parentEl) + 6;
      const y1 = centroVertical(parentEl);
      const x2 = bordaEsquerda(filhoEl) - 6;
      const y2 = centroVertical(filhoEl);

      const glow = document.createElementNS(SVG_NS, "path");
      glow.setAttribute("d", criarPathCurvo(x1, y1, x2, y2));
      glow.setAttribute("stroke", corTexto); 
      glow.setAttribute("stroke-width", "7");
      glow.setAttribute("stroke-linecap", "round");
      glow.setAttribute("fill", "none");
      glow.setAttribute("opacity", "0.3");

      const linha = document.createElementNS(SVG_NS, "path");
      linha.setAttribute("d", criarPathCurvo(x1, y1, x2, y2));
      linha.setAttribute("stroke", corParent);
      linha.setAttribute("stroke-width", "4");
      linha.setAttribute("stroke-linecap", "round");
      linha.setAttribute("fill", "none");
      linha.setAttribute("opacity", "0.95");

      layer.appendChild(glow);
      layer.appendChild(linha);

      if (!ligacoesRenderizadas.has(chaveLigacao)) {
        animarCaminho(glow, 620);
        animarCaminho(linha, 520);
      }
    });

    ligacoesRenderizadas = novasLigacoes;
  }



  window.addEventListener("resize", desenharLigacoes);
  window.addEventListener("scroll", desenharLigacoes);
