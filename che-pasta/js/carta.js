(function () {
  "use strict";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var IT = {}; (window.ITALIA || []).forEach(function (p) { IT[p.k] = p; });
  var CORTA = window.ITALIA_CORTA || {};
  var LUGAR = { napoles: "Nápoles", trevi: "Roma", roma: "Roma", bolonia: "Bolonia", amatrice: "Amatrice", genova: "Génova", venecia: "Venecia", milan: "Milán", treviso: "Treviso", piamonte: "Piamonte", florencia: "Florencia", verona: "Verona", amalfi: "Amalfi" };

  /* ---------- opciones ---------- */
  var PASTA3 = { k: "pasta", t: "Escoge tu pasta", v: [["tagliatelle", "Tagliatelle"], ["spaghetti", "Spaghetti"], ["pappardelle", "Pappardelle"]] };
  var SAL = { napolitana: "Napolitana", alfredo: "Alfredo", ragu: "Ragú", amatriciana: "Amatriciana", pesto: "Pesto", nueces: "Nueces", puttanesca: "Puttanesca", blanca: "Blanca", casa: "De la casa", marisco: "Marisco", mariscoNap: "Marisco napolitana", tomatefresco: "Tomate fresco" };
  function salsas(ks) { return { k: "salsa", t: "Escoge la salsa", v: ks.map(function (k) { return [k, SAL[k]]; }) }; }
  function rellenos(v) { return { k: "relleno", t: "Escoge el relleno", v: v }; }
  var ACOMP = [{ k: "pasta", t: "Acompáñalo con", v: PASTA3.v }, { k: "salsa", t: "En salsa", v: [["alfredo", "Alfredo"], ["napolitana", "Napolitana"]] }];
  function ruta(k) { return k === "mariscoNap" ? "marisco" : k === "casa" ? "napolitana" : k; }
  function lista(t, k, arr) { return { k: k || "op", t: t, v: arr.map(function (x) { return [x, x]; }) }; }

  /* ---------- la carta (Menüpp de Che Pasta, sin precios) ---------- */
  function pasta(k, n, d, l, o, tags) { return { id: k, n: n, d: d, l: l, o: o, tags: tags, ft: "img/plato2/{pasta}_" + k + ".webp", op: [PASTA3], arma: { salsa: k } }; }
  var CAT = [
    { k: "pastas", t: "Pastas", ico: "img/plato2/tagliatelle_carbonara.webp", sub: "Pasta fresca de nuestra fábrica: spaghetti, tagliatelle o pappardelle, con la salsa que quieras.", fotos: true, items: [
      pasta("carbonara", "Carbonara", "Tocineta, huevo y crema.", ["Tocineta", "Huevo", "Crema"], "roma", ["Clásico"]),
      pasta("pesto", "Pesto genovés", "Albahaca, piñones y parmesano.", ["Albahaca", "Piñones", "Parmesano"], "genova", ["De la tierra del chef"]),
      pasta("ragu", "Ragú", "Carne, tomate y especias.", ["Carne", "Tomate", "Especias"], "bolonia"),
      pasta("napolitana", "Napolitana", "Tomate y especias. La salsa roja de la casa.", ["Tomate", "Especias"], "napoles"),
      pasta("alfredo", "Alfredo", "Mantequilla, crema de leche y romero.", ["Mantequilla", "Crema de leche", "Romero"], "trevi"),
      pasta("amatriciana", "Amatriciana", "Napolitana, tocineta y un toque picante.", ["Napolitana", "Tocineta", "Picante"], "amatrice", ["Picante"]),
      pasta("blanca", "Blanca", "Crema de leche, hongos y especias.", ["Crema de leche", "Hongos", "Especias"]),
      pasta("puttanesca", "Puttanesca", "Anchoa, aceituna y alcaparra.", ["Anchoa", "Aceituna", "Alcaparra"], "napoles"),
      pasta("ortolana", "Ortolana", "Verduras de estación en salsa napolitana.", ["Verduras de estación", "Napolitana"]),
      pasta("albnap", "Albóndigas en napolitana", "Albóndigas de la casa en salsa de tomate.", ["Albóndigas", "Napolitana"]),
      pasta("albragu", "Albóndigas en ragú", "Albóndigas de la casa en ragú de carne.", ["Albóndigas", "Ragú"]),
      pasta("alfcam", "Alfredo con camarón", "La Alfredo de siempre, con camarones.", ["Camarón", "Mantequilla", "Crema de leche"]),
      pasta("marisco", "Marisco", "Calamar, camarón, mejillones y tomate.", ["Calamar", "Camarón", "Mejillones", "Tomate"]),
      pasta("tinta", "Marisco en tinta de calamar", "Frutos del mar en salsa negra de tinta de calamar.", ["Frutos del mar", "Tinta de calamar"], "venecia"),
      pasta("marymonte", "Mar y monte", "Lo del mar y lo de la tierra en un mismo plato.", [])
    ] },
    { k: "raviolis", t: "Raviolis", ico: "img/plato2/raviolis_ragu.webp", sub: "Rellenos y cerrados a mano en nuestra fábrica. Escoge el relleno y la salsa.", fotos: true, items: [
      { id: "rav-carne", n: "Raviolis de carne, mixtos o de ricotta", d: "Los clásicos de la casa, con siete salsas para escoger.", o: "genova", tags: ["Hechos a mano"], ft: "img/plato2/raviolis_{salsa}.webp", op: [rellenos([["carne", "De carne"], ["mixto", "Mixtos"], ["ricotta", "De ricotta"]]), salsas(["ragu", "napolitana", "alfredo", "amatriciana", "pesto", "nueces", "puttanesca"])], arma: { pasta: "raviolis" } },
      { id: "rav-quesos", n: "Raviolis 4 quesos o sorrentina", d: "Rellenos de queso que se derriten en la boca.", ft: "img/plato2/raviolis_{salsa}.webp", op: [rellenos([["cuatroquesos", "4 quesos"], ["sorrentina", "Sorrentina"]]), salsas(["napolitana", "blanca", "nueces", "amatriciana", "casa", "puttanesca", "ragu"])], arma: { pasta: "raviolis" } },
      { id: "rav-cordero", n: "Raviolis de cordero", d: "Relleno de cordero, en napolitana o salsa blanca.", ft: "img/plato2/raviolis_{salsa}.webp", op: [salsas(["napolitana", "blanca"])], fijo: { relleno: "cordero" }, arma: { pasta: "raviolis" } },
      { id: "rav-portobello", n: "Raviolis de portobello", d: "Relleno de hongo portobello, en salsa blanca o de marisco.", ft: "img/plato2/raviolis_{salsa}.webp", op: [salsas(["blanca", "marisco"])], fijo: { relleno: "portobello" }, arma: { pasta: "raviolis" } },
      { id: "rav-mar", n: "Raviolis de salmón o de jaiba", d: "Rellenos del mar, con salsas que los acompañan.", ft: "img/plato2/raviolis_{salsa}.webp", op: [rellenos([["salmon", "De salmón"], ["jaiba", "De jaiba"]]), salsas(["blanca", "tomatefresco", "mariscoNap", "marisco"])], arma: { pasta: "raviolis" } }
    ] },
    { k: "gnocchi", t: "Gnocchi", ico: "img/plato2/gnocchi_pesto.webp", sub: "De papa y harina, con sus rayitas para que la salsa se pegue.", fotos: true, items: [
      { id: "gn-pesto", n: "Gnocchi al pesto", d: "Gnocchi de papa con pesto genovés.", l: ["Papa", "Harina", "Pesto"], o: "verona", f: "img/plato2/gnocchi_pesto.webp", arma: { pasta: "gnocchi", salsa: "pesto" } },
      { id: "gn-napolitana", n: "Gnocchi en napolitana", d: "Gnocchi de papa en salsa de tomate.", l: ["Papa", "Harina", "Napolitana"], o: "verona", f: "img/plato2/gnocchi_napolitana.webp", arma: { pasta: "gnocchi", salsa: "napolitana" } },
      { id: "gn-ragu", n: "Gnocchi al ragú", d: "Gnocchi de papa con ragú de carne.", l: ["Papa", "Harina", "Ragú"], o: "verona", f: "img/plato2/gnocchi_ragu.webp", arma: { pasta: "gnocchi", salsa: "ragu" } }
    ] },
    { k: "horno", t: "Lasaña y risotto", ico: "img/f-lasana.webp", sub: "Del horno y de la olla.", banner: "img/f-lasana.webp", items: [
      { id: "lasana", n: "Lasaña", d: "Gratinada al horno, mixta o de carne.", o: "bolonia", f: "img/f-lasana.webp", op: [lista("¿Cuál quieres?", "tipo", ["Mixta", "De carne"])] },
      { id: "canelloni", n: "Canelloni de pollo", d: "Tubos de pasta rellenos de pollo." },
      { id: "risotto-negro", n: "Risotto negro y marisco", d: "Arroz cremoso en tinta de calamar con frutos del mar.", o: "venecia", f: "img/f-risotto.webp" },
      { id: "risotto-funghi", n: "Risotto funghi", d: "Con portobello y porcini.", l: ["Portobello", "Porcini"] },
      { id: "risotto-ossobuco", n: "Risotto zafferano e ossobuco", d: "Risotto al azafrán con ossobuco, como se sirve en Milán.", o: "milan" }
    ] },
    { k: "fuertes", t: "Platos fuertes", ico: "img/f-ossobuco.webp", sub: "Carnes, pollo y pescado, con pasta fresca en salsa Alfredo o napolitana.", banner: "img/f-ossobuco.webp", items: [
      { id: "ossobuco", n: "Ossobuco", d: "Ternera al vino tinto, con pasta.", x: "Jarrete de ternera con su hueso, guisado al vino tinto.", o: "milan", f: "img/f-ossobuco.webp", op: ACOMP },
      { id: "lomo-viche", n: "Lomo viche", d: "Con pasta y ensalada.", tags: ["Recomendado"], op: ACOMP },
      { id: "filet", n: "Filet mignon", d: "Con pasta en Alfredo o napolitana.", op: ACOMP },
      { id: "porchetta", n: "Porchetta", d: "Pernil de cerdo al horno, con pasta.", op: ACOMP },
      { id: "pollo-pizzaiola", n: "Pollo pizzaiola", d: "Filete de pollo con napolitana, tomate, mozzarella de búfala y pesto. Con ensalada y pasta.", tags: ["Nuevo", "Recomendado"], op: ACOMP },
      { id: "pollo-ron", n: "Pollo al ron", d: "El secreto del chef, con pasta fresca.", op: ACOMP },
      { id: "pollo-limon", n: "Pollo al limón", d: "Filete de pechuga, con pasta y ensalada.", op: ACOMP },
      { id: "pollo-crispy", n: "Pollo crispy", d: "Pechuga de pollo crocante, con pasta.", op: ACOMP },
      { id: "pollo-cacciatora", n: "Pollo alla cacciatora", d: "Pierna pernil de pollo, con pasta.", op: ACOMP },
      { id: "salmon", n: "Salmón a la plancha", d: "Con ensalada y pasta.", op: ACOMP }
    ] },
    { k: "entradas", t: "Entradas", ico: "img/plato2/raviolis_tomatefresco.webp", sub: "Para abrir la mesa y compartir.", items: [
      { id: "antipasto", n: "Antipasto italiano", d: "Prosciutto crudo, mortadela, salame, verdura asada y mozzarella de búfala.", tags: ["Para compartir"] },
      { id: "fritto", n: "Fritto misto di mare", d: "Camarones y anillos de calamar fritos, como en la costa italiana." },
      { id: "burrata", n: "Burrata", d: "Sobre tomate y berenjena asados, con un toque de pesto genovés." },
      { id: "caprese", n: "Caprese", d: "Mozzarella de búfala, tomate fresco y pesto genovés." },
      { id: "carpaccio", n: "Carpaccio", d: "Lomo viche de res marinado al limón, con rúgula y parmesano." },
      { id: "carpaccio-salmon", n: "Carpaccio de salmón", d: "Salmón en láminas finas." },
      { id: "coctel", n: "Cóctel de camarones", d: "Camarones en salsa cóctel." },
      { id: "parmigiana", n: "Parmigiana", d: "Berenjenas al horno con mozzarella napolitana." },
      { id: "bruschetta", n: "Bruschetta", d: "Pan de la casa, tomate fresco, aceitunas, mozzarella y pesto." },
      { id: "verdura", n: "Verdura asada", d: "Berenjena, pimentón, mozzarella, calabacín y aceitunas." }
    ] },
    { k: "postres", t: "Postres", ico: "img/postre/tiramisu.webp", sub: "Para cerrar como se debe.", fotos: true, items: [
      { id: "tiramisu", n: "Tiramisú", d: "Café, mascarpone, bizcochos y cacao.", o: "treviso", f: "img/postre/tiramisu.webp", tags: ["Clásico"] },
      { id: "pannacotta", n: "Panna cotta", d: "Crema cocida y cuajada, con frutos rojos.", o: "piamonte", f: "img/postre/pannacotta.webp" },
      { id: "raviolichoc", n: "Raviolis de chocolate", d: "Nuestros raviolis en versión dulce, con helado.", f: "img/postre/raviolichoc.webp", tags: ["De la casa"] },
      { id: "torta", n: "Torta de chocolate", d: "Con helado.", f: "img/postre/torta.webp" },
      { id: "affogato", n: "Affogato all'amaretto", d: "Helado «ahogado» en café, con amaretto.", f: "img/postre/affogato.webp" }
    ] },
    { k: "bebidas", t: "Bebidas", ico: "img/bebida/soda.webp", sub: "Sodas italianas, limonadas, jugos naturales y más.", fotos: true, items: [
      { id: "soda", n: "Soda italiana", d: "Burbujas con sabor a fruta. También con licor.", f: "img/bebida/soda.webp", op: [lista("Escoge el sabor", "sabor", ["Cherry", "Curazao", "Manzana verde", "Maracuyá", "Frutos rojos", "Fresa"]), lista("¿Con licor?", "licor", ["Sin licor", "Con licor"])] },
      { id: "limonada", n: "Limonada", d: "Cerezada, de coco, de yerbabuena o natural.", f: "img/bebida/limonada.webp", op: [lista("Escoge", "tipo", ["Cerezada", "De coco", "De yerbabuena", "Natural"])] },
      { id: "jugo", n: "Jugo natural", d: "En agua o en leche.", f: "img/bebida/jugo.webp", op: [lista("Escoge la fruta", "fruta", ["Maracuyá", "Mango", "Lulo", "Frutos rojos", "Guanábana"]), lista("¿En agua o en leche?", "base", ["En agua", "En leche"])] },
      { id: "gaseosa", n: "Gaseosas y agua", d: "Coca-Cola, Bretaña, Premio, Ginger Ale, té Hatsu o agua.", f: "img/bebida/gaseosa.webp", op: [lista("Escoge", "cual", ["Coca-Cola", "Bretaña", "Premio", "Ginger Ale", "Té Hatsu", "Agua natural", "Agua con gas"])] },
      { id: "cafe", n: "Cafés y aromáticas", d: "Café, café con leche o aromática.", op: [lista("Escoge", "cual", ["Café", "Café con leche", "Frutos rojos", "Manzanilla", "Limoncillo", "Té verde"])] },
      { id: "cerveza", n: "Cerveza", d: "Club Colombia, Cordillera, Poker, Stella Artois, Heineken o Corona.", op: [lista("Escoge", "cual", ["Club Colombia", "Cordillera", "Poker", "Stella Artois", "Heineken", "Corona"])] }
    ] },
    { k: "vinos", t: "Vinos y cocteles", ico: "img/bebida/vino.webp", sub: "Italia también se sirve en copa.", items: [
      { id: "vino-tinto", n: "Vinos tintos", d: "Lambrusco, Sangiovese, Chianti, Montepulciano, Valpolicella y Barbera d'Asti.", op: [lista("Escoge el vino", "vino", ["Lambrusco", "Sangiovese", "Ruffino Chianti", "Montepulciano", "Valpolicella", "Barbera d'Asti"])] },
      { id: "vino-blanco", n: "Blancos y rosados", d: "Lambrusco rosé, Chardonnay, Orvieto y Pinot Grigio.", op: [lista("Escoge el vino", "vino", ["Lambrusco rosé", "Chardonnay", "Orvieto", "Pinot Grigio"])] },
      { id: "vino-casa", n: "Tinto de la casa", d: "Por copa, ¼ o ½ litro.", op: [lista("¿Cuánto?", "medida", ["Copa", "¼ litro", "½ litro"])] },
      { id: "sangria", n: "Sangría en jarra", d: "Para compartir en la mesa." },
      { id: "tinto-verano", n: "Tinto de verano", d: "Vino tinto refrescante, por copa." },
      { id: "negroni", n: "Negroni", d: "El cóctel que nació en Florencia.", o: "florencia" },
      { id: "aperol", n: "Aperol spritz", d: "El aperitivo naranja de Italia." },
      { id: "limoncello", n: "Limoncello", d: "Licor de limón, servido frío.", o: "amalfi" },
      { id: "grappa", n: "Grappa", d: "Aguardiente italiano para cerrar la comida." }
    ] }
  ];
  var TODOS = []; CAT.forEach(function (c) { c.items.forEach(function (it) { it.cat = c; TODOS.push(it); }); });
  function porId(id) { return TODOS.filter(function (x) { return x.id === id; })[0]; }

  /* ---------- utilidades ---------- */
  function selDefecto(it) { var s = {}; (it.op || []).forEach(function (o) { s[o.k] = o.v[0][0]; }); for (var k in it.fijo || {}) s[k] = it.fijo[k]; return s; }
  function foto(it, sel) {
    if (it.ft) return it.ft.replace(/\{(\w+)\}/g, function (_, k) { return k === "salsa" ? ruta(sel[k]) : sel[k]; });
    return it.f || "";
  }
  function chica(src) { return /img\/plato2\//.test(src) ? src.replace("img/plato2/", "img/plato2/s/") : src; }
  function detalle(it, sel) { return (it.op || []).map(function (o) { var v = o.v.filter(function (x) { return x[0] === sel[o.k]; })[0]; return v ? v[1] : ""; }).filter(Boolean).join(" · "); }
  function enlaceArma(it, sel) {
    if (!it.arma) return "";
    var p = it.arma.pasta || sel.pasta, q = "pasta=" + p;
    var rel = sel.relleno || (it.fijo && it.fijo.relleno); if (rel) q += "&relleno=" + rel;
    var s = it.arma.salsa || sel.salsa; if (s) q += "&salsa=" + s;
    return "arma-tu-pasta.html#" + q;
  }
  function agregar(it, sel, cant, desde) {
    var d = detalle(it, sel);
    window.PEDIDO.agregar({ id: "carta|" + it.id + "|" + d, n: it.n, d: d, f: chica(foto(it, sel)), t: "carta", c: cant || 1 }, desde);
  }
  var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#fff"/></svg>';
  var MAS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

  /* ---------- pintar la carta ---------- */
  var nav = $("#carta-nav"), app = $("#carta-app");
  CAT.forEach(function (c, ci) {
    var b = document.createElement("a"); b.href = "#" + c.k; b.innerHTML = '<img src="' + chica(c.ico) + '" alt="" width="28" height="28">' + c.t; nav.appendChild(b);
    var s = document.createElement("section"); s.className = "cat cat-" + (c.fotos ? "fotos" : "pizarra"); s.id = c.k;
    var html = '<header class="cat-cab"><span class="cat-n">' + ("0" + (ci + 1)).slice(-2) + '</span><div><h2>' + c.t + '</h2><p>' + c.sub + '</p></div></header>';
    if (c.fotos) {
      html += '<div class="platos">';
      c.items.forEach(function (it, i) {
        var sel = selDefecto(it), src = foto(it, sel), lugar = it.o ? '<span class="plato-origen">' + PIN + LUGAR[it.o] + '</span>' : "";
        var tags = (it.tags || []).slice(0, 1).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join("");
        html += '<article class="plato" data-id="' + it.id + '" style="--i:' + (i % 8) + '">' +
          '<button type="button" class="plato-abre" data-abre="' + it.id + '"><span class="sr">Ver ' + it.n + '</span></button>' +
          '<div class="plato-img"><img src="' + chica(src) + '" alt="' + it.n + '" loading="lazy" width="420" height="420"></div>' + lugar +
          '<div class="plato-txt">' + tags + '<h3>' + it.n + '</h3><p>' + it.d + '</p></div>' +
          '<button type="button" class="plato-add" data-add="' + it.id + '" aria-label="Agregar ' + it.n + ' al pedido">' + MAS + '</button></article>';
      });
      html += '</div>';
    } else {
      html += '<div class="pizarra' + (c.banner ? " con-banner" : "") + '">' + (c.banner ? '<figure class="pizarra-foto"><img src="' + c.banner + '" alt="' + c.t + '" loading="lazy" width="640" height="800"></figure>' : "") + '<ul class="filas">';
      c.items.forEach(function (it) {
        var tags = (it.tags || []).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join("");
        html += '<li class="fila" data-id="' + it.id + '"><button type="button" class="fila-abre" data-abre="' + it.id + '">' +
          (it.f ? '<img class="fila-mini" src="' + chica(it.f) + '" alt="" loading="lazy" width="56" height="56">' : "") +
          '<span class="fila-txt"><span class="fila-n">' + it.n + tags + (it.o ? '<span class="fila-origen">' + PIN + LUGAR[it.o] + '</span>' : "") + '</span><small>' + it.d + '</small></span></button>' +
          '<button type="button" class="plato-add" data-add="' + it.id + '" aria-label="Agregar ' + it.n + ' al pedido">' + MAS + '</button></li>';
      });
      html += '</ul></div>';
    }
    s.innerHTML = html; app.appendChild(s);
  });

  app.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add]");
    if (a) { var it = porId(a.dataset.add); if ((it.op || []).length > 1) abrir(it); else agregar(it, selDefecto(it), 1, a); return; }
    var o = e.target.closest("[data-abre]"); if (o) abrir(porId(o.dataset.abre));
  });

  /* ---------- buscador ---------- */
  var bus = $("#carta-buscar"), nada = $("#carta-nada");
  function norm(t) { return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  if (bus) bus.addEventListener("input", function () {
    var q = norm(bus.value.trim()), alguno = false;
    CAT.forEach(function (c) {
      var vis = 0;
      c.items.forEach(function (it) {
        var ok = !q || norm(it.n + " " + it.d + " " + (it.l || []).join(" ") + " " + (it.o ? LUGAR[it.o] : "") + " " + (it.op || []).map(function (o) { return o.v.map(function (v) { return v[1]; }).join(" "); }).join(" ")).indexOf(q) > -1;
        $$('[data-id="' + it.id + '"]', app).forEach(function (el) { el.hidden = !ok; }); if (ok) vis++;
      });
      document.getElementById(c.k).hidden = !vis; $('a[href="#' + c.k + '"]', nav).hidden = !vis; if (vis) alguno = true;
    });
    nada.hidden = alguno;
  });

  /* ---------- pestaña activa ---------- */
  var links = $$("a", nav);
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { var on = a.getAttribute("href") === "#" + e.target.id; a.classList.toggle("on", on); if (on) nav.scrollTo({ left: a.offsetLeft - 20, behavior: "smooth" }); });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  $$(".cat").forEach(function (s) { io.observe(s); });
  links.forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); var t = document.getElementById(a.getAttribute("href").slice(1)); scrollTo({ top: t.getBoundingClientRect().top + scrollY - 128, behavior: "smooth" }); }); });

  /* ---------- ficha del plato ---------- */
  var fi = $("#ficha"), caja = $(".ficha-caja", fi), actual = null, sel = {}, cant = 1, ultimoFoco = null;
  function abrir(it, sinHistoria) {
    if (!it) return;
    actual = it; sel = selDefecto(it); cant = 1;
    if (fi.hidden) ultimoFoco = document.activeElement;
    var src = foto(it, sel), conFoto = !!src;
    caja.classList.toggle("sin-foto", !conFoto);
    $(".ficha-foto img", fi).src = src || ""; $(".ficha-foto img", fi).alt = it.n;
    $(".ficha-cat", fi).textContent = it.cat.t;
    $(".ficha-tags", fi).innerHTML = (it.tags || []).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join("") + (it.o ? '<span class="tag tag-origen">' + PIN + 'Nace en ' + LUGAR[it.o] + '</span>' : "");
    $("#ficha-tit").textContent = it.n;
    $(".ficha-d", fi).textContent = it.x ? it.d + " " + it.x : it.d;
    $(".ficha-lleva", fi).innerHTML = (it.l && it.l.length) ? '<span>Lleva</span>' + it.l.map(function (x) { return "<i>" + x + "</i>"; }).join("") : "";
    pintaOps(); pintaCant(); historia(it);
    var lugarCat = it.cat.items.indexOf(it);
    $(".ficha-prev", fi).hidden = lugarCat === 0; $(".ficha-sig", fi).hidden = lugarCat === it.cat.items.length - 1;
    $(".ficha-pos", fi).textContent = (lugarCat + 1) + " de " + it.cat.items.length;
    if (fi.hidden) { fi.hidden = false; document.body.classList.add("ficha-abierta"); requestAnimationFrame(function () { fi.classList.add("on"); }); }
    else { caja.classList.remove("cambia"); void caja.offsetWidth; caja.classList.add("cambia"); }
    $(".ficha-info", fi).scrollTop = 0; caja.scrollTop = 0;
    try { history.replaceState(null, "", "#plato=" + it.id); } catch (e) {}
    setTimeout(function () { $(".ficha-x", fi).focus({ preventScroll: true }); }, 60);
  }
  function cerrar() {
    fi.classList.remove("on"); document.body.classList.remove("ficha-abierta"); paraHist();
    setTimeout(function () { fi.hidden = true; }, 350);
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
  }
  function pintaOps() {
    var it = actual;
    $(".ficha-ops", fi).innerHTML = (it.op || []).map(function (o) {
      return '<div class="op"><p>' + o.t + '</p><div class="op-v" role="radiogroup" aria-label="' + o.t + '">' + o.v.map(function (v) {
        return '<button type="button" role="radio" aria-checked="' + (sel[o.k] === v[0]) + '" data-k="' + o.k + '" data-v="' + v[0] + '">' + v[1] + '</button>';
      }).join("") + '</div></div>';
    }).join("");
    var arma = enlaceArma(it, sel), ae = $(".ficha-arma", fi);
    ae.hidden = !arma; if (arma) ae.href = arma;
  }
  function pintaCant() { $(".ficha-cant b", fi).textContent = cant; }
  $(".ficha-ops", fi).addEventListener("click", function (e) {
    var b = e.target.closest("button[data-k]"); if (!b) return;
    sel[b.dataset.k] = b.dataset.v; pintaOps();
    var src = foto(actual, sel), img = $(".ficha-foto img", fi);
    if (src && img.getAttribute("src") !== src) {
      if (window.CP.reduce) { img.src = src; return; }
      img.animate([{ transform: "rotate(0) scale(1)", opacity: 1 }, { transform: "rotate(-40deg) scale(.86)", opacity: 0 }], { duration: 220, easing: "ease-in" }).onfinish = function () {
        img.src = src; img.animate([{ transform: "rotate(40deg) scale(.86)", opacity: 0 }, { transform: "rotate(0) scale(1)", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
      };
    }
  });
  $(".ficha-cant", fi).addEventListener("click", function (e) { var b = e.target.closest("button[data-d]"); if (!b) return; cant = Math.max(1, Math.min(20, cant + +b.dataset.d)); pintaCant(); });
  $(".ficha-agregar", fi).addEventListener("click", function (e) { agregar(actual, sel, cant, $(".ficha-foto img", fi).src ? $(".ficha-foto img", fi) : e.currentTarget); setTimeout(cerrar, 250); });
  function vecino(d) { var l = actual.cat.items, i = l.indexOf(actual) + d; if (i >= 0 && i < l.length) abrir(l[i]); }
  $(".ficha-prev", fi).onclick = function () { vecino(-1); }; $(".ficha-sig", fi).onclick = function () { vecino(1); };
  fi.addEventListener("click", function (e) { if (e.target.closest("[data-fcierra]")) cerrar(); });
  addEventListener("keydown", function (e) {
    if (fi.hidden) return;
    if (e.key === "Escape") cerrar();
    if (e.target.tagName !== "INPUT" && e.key === "ArrowRight") vecino(1);
    if (e.target.tagName !== "INPUT" && e.key === "ArrowLeft") vecino(-1);
  });
  // deslizar en el celular para pasar de plato
  var x0 = null;
  $(".ficha-foto", fi).addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  $(".ficha-foto", fi).addEventListener("touchend", function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) vecino(dx < 0 ? 1 : -1); x0 = null; });

  /* ---------- la historia del plato, en tres pantallas ---------- */
  var hist = $(".hist", fi), hTimer = null, hPaso = 0, hDatos = null;
  function historia(it) {
    paraHist();
    var p = it.o && IT[it.o];
    hist.hidden = !p; if (!p) return;
    hDatos = [
      { a: "La historia de este plato", t: "Nace en " + p.ciudad, s: p.region + " · " + p.plato },
      { a: "Así nació", t: "", s: CORTA[it.o] || "" },
      { a: "¿Sabías que…?", t: "", s: p.dato }
    ];
    $(".hist-fondo", hist).style.backgroundImage = "url(img/italia/m/" + p.img + ".webp)";
    $(".hist-link", hist).href = "italia.html#" + p.k;
    hPaso = 0; pintaHist(); if (!window.CP.reduce) arrancaHist();
  }
  function pintaHist() {
    var d = hDatos[hPaso];
    $$(".hist-barras i", hist).forEach(function (b, i) { b.className = i < hPaso ? "llena" : i === hPaso ? "va" : ""; });
    var txt = $(".hist-txt", hist);
    txt.innerHTML = '<span class="hist-a">' + d.a + '</span>' + (d.t ? '<b>' + d.t + '</b>' : "") + '<p>' + d.s + '</p>';
    txt.classList.remove("entra"); void txt.offsetWidth; txt.classList.add("entra");
    hist.classList.toggle("ultimo", hPaso === hDatos.length - 1);
  }
  function arrancaHist() { clearInterval(hTimer); hist.classList.add("corre"); hTimer = setInterval(function () { if (hPaso < hDatos.length - 1) { hPaso++; pintaHist(); } else paraHist(); }, 5200); }
  function paraHist() { clearInterval(hTimer); hTimer = null; hist.classList.remove("corre"); }
  hist.addEventListener("click", function (e) {
    if (e.target.closest(".hist-link")) return;
    var r = hist.getBoundingClientRect(), atras = e.clientX - r.left < r.width * 0.3;
    hPaso = Math.max(0, Math.min(hDatos.length - 1, hPaso + (atras ? -1 : 1))); pintaHist(); if (!window.CP.reduce) arrancaHist();
  });

  /* abrir un plato desde el enlace (#plato=carbonara) */
  var m = /plato=([\w-]+)/.exec(location.hash);
  if (m && porId(m[1])) setTimeout(function () { var it = porId(m[1]); var el = $('[data-id="' + it.id + '"]', app); if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - 200 }); abrir(it); }, 200);
})();
