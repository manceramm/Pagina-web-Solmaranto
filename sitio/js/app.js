/* Solmaranto · comportamiento del sitio.
   Lee todo desde ../datos.js (window.SOLMARANTO). No hace falta editar este archivo. */
(function () {
  "use strict";

  var D = window.SOLMARANTO || {};
  var T = D.taller || {};
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
               "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  /* ---------- utilidades ---------- */

  function el(tag, clase, texto) {
    var nodo = document.createElement(tag);
    if (clase) nodo.className = clase;
    if (texto) nodo.textContent = texto;
    return nodo;
  }

  function pendiente(texto) {
    return el("span", "pendiente", "[PENDIENTE: " + texto + "]");
  }

  function partesFecha(f) {
    var p = f.split("-");
    var a = +p[0], m = +p[1], d = +p[2];
    var dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
    return { anio: a, mes: MESES[m - 1], dia: d, diaSemana: DIAS[dia] };
  }

  function fechaLarga(f, conAnio) {
    var p = partesFecha(f);
    var t = p.diaSemana + " " + p.dia + " de " + p.mes;
    return conAnio ? t + " de " + p.anio : t;
  }

  function fechaCorta(f) {
    var p = partesFecha(f);
    return p.diaSemana.slice(0, 3) + " " + p.dia + " " + p.mes.slice(0, 3);
  }

  // Una fecha deja de mostrarse al terminar ese día, hora de Bogotá (UTC-5).
  function yaPaso(f) {
    return Date.now() > new Date(f + "T23:59:59-05:00").getTime();
  }

  function fechasVigentes() {
    return (D.fechas || [])
      .filter(function (x) { return !yaPaso(x.fecha); })
      .sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; });
  }

  function dinero(n) {
    return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " COP";
  }

  function numeroWhatsApp() {
    return (D.whatsapp || "").replace(/\D/g, "");
  }

  function enlaceWhatsApp(mensaje) {
    return "https://wa.me/" + numeroWhatsApp() + "?text=" + encodeURIComponent(mensaje);
  }

  function mensajeGeneral() {
    return "Hola, quiero reservar mi cupo en " + T.nombre + ".";
  }

  function mensajeFecha(f) {
    return "Hola, quiero reservar mi cupo en " + T.nombre + " para el " + fechaLarga(f) + ".";
  }

  /* ---------- datos sueltos en el texto ---------- */

  function textoDato(clave) {
    switch (clave) {
      case "nombre": return T.nombre;
      case "lugar": return T.lugar;
      case "hora": return T.hora;
      case "duracion": return T.duracion;
      case "cupos": return T.cupos + " por fecha";
      case "precio": return dinero(T.precio);
      case "notaPrecio": return T.notaPrecio;
      case "rnt": return D.rnt;
      case "correo": return D.correo;
      case "instagram": return "@" + D.instagram;
      case "guia": return D.guia;
      case "anio": return String(new Date().getFullYear());
    }
    return "";
  }

  function rellenarDatos() {
    var nodos = document.querySelectorAll("[data-dato]");
    for (var i = 0; i < nodos.length; i++) {
      var clave = nodos[i].getAttribute("data-dato");
      if (clave === "whatsapp") {
        var n = numeroWhatsApp();
        if (n) {
          nodos[i].textContent = "+" + n.replace(/^(\d{2})(\d{3})(\d{3})(\d+)$/, "$1 $2 $3 $4");
        } else {
          nodos[i].textContent = "";
          nodos[i].appendChild(pendiente("WhatsApp"));
        }
      } else if (clave === "rnt" && !D.rnt) {
        nodos[i].textContent = "";
        nodos[i].appendChild(pendiente("número de RNT"));
      } else {
        nodos[i].textContent = textoDato(clave);
      }
    }

    var correos = document.querySelectorAll("[data-enlace='correo']");
    for (var c = 0; c < correos.length; c++) correos[c].href = "mailto:" + D.correo;

    var insta = document.querySelectorAll("[data-enlace='instagram']");
    for (var s = 0; s < insta.length; s++) {
      insta[s].href = "https://www.instagram.com/" + D.instagram + "/";
      insta[s].target = "_blank";
      insta[s].rel = "noopener";
    }
  }

  /* ---------- botones de WhatsApp ---------- */

  function conectarBotonesWhatsApp() {
    var botones = document.querySelectorAll("a[data-wa]");
    for (var i = 0; i < botones.length; i++) {
      var f = botones[i].getAttribute("data-wa");
      botones[i].href = enlaceWhatsApp(f ? mensajeFecha(f) : mensajeGeneral());
      botones[i].target = "_blank";
      botones[i].rel = "noopener";
    }
  }

  /* ---------- fechas ---------- */

  function estadoTexto(estado) {
    return estado === "agotado" ? "Agotado" : "Cupos disponibles";
  }

  function pintarChips(lista) {
    var vigentes = fechasVigentes();
    lista.textContent = "";
    vigentes.forEach(function (x) {
      var li = el("li", "chip" + (x.estado === "agotado" ? " chip--agotado" : ""));
      li.appendChild(el("span", "chip__dia", fechaCorta(x.fecha)));
      li.appendChild(el("span", "chip__estado", estadoTexto(x.estado)));
      lista.appendChild(li);
    });
    if (!vigentes.length) lista.appendChild(el("li", "chip chip--vacio", "Pronto anunciaremos nuevas fechas"));
  }

  function pintarTarjetas(lista) {
    var vigentes = fechasVigentes();
    lista.textContent = "";
    vigentes.forEach(function (x) {
      var agotada = x.estado === "agotado";
      var li = el("li", "fecha" + (agotada ? " fecha--agotada" : ""));
      var info = el("div", "fecha__info");
      info.appendChild(el("strong", "fecha__dia", fechaLarga(x.fecha, true)));
      info.appendChild(el("span", "fecha__detalle",
        T.hora + " · " + T.lugar + " · " + estadoTexto(x.estado)));
      li.appendChild(info);
      if (!agotada) {
        var a = el("a", "boton boton--chico", "Reservar esta fecha");
        a.setAttribute("data-wa", x.fecha);
        a.setAttribute("aria-label", "Reservar el cupo del " + fechaLarga(x.fecha) + " por WhatsApp");
        li.appendChild(a);
      }
      lista.appendChild(li);
    });
    if (!vigentes.length) {
      var vacio = el("li", "fecha fecha--vacia");
      vacio.appendChild(el("p", "", "Pronto anunciaremos nuevas fechas. Escríbenos por WhatsApp y cuéntanos que te interesa."));
      var b = el("a", "boton boton--chico", "Escríbenos por WhatsApp");
      b.setAttribute("data-wa", "");
      vacio.appendChild(b);
      lista.appendChild(vacio);
    }
  }

  function pintarFechas() {
    var chips = document.querySelectorAll("[data-fechas='chips']");
    for (var i = 0; i < chips.length; i++) pintarChips(chips[i]);
    var tarjetas = document.querySelectorAll("[data-fechas='tarjetas']");
    for (var j = 0; j < tarjetas.length; j++) pintarTarjetas(tarjetas[j]);
  }

  /* ---------- testimonios ---------- */

  function pintarTestimonios() {
    var seccion = document.getElementById("testimonios");
    var lista = document.querySelector("[data-testimonios]");
    var items = D.testimonios || [];
    if (seccion && lista && items.length) {
      items.forEach(function (t) {
        var fig = el("figure", "testimonio");
        var cita = el("blockquote", "testimonio__texto");
        cita.appendChild(el("p", "", t.comentario));
        fig.appendChild(cita);
        fig.appendChild(el("figcaption", "testimonio__autor", t.nombre));
        lista.appendChild(fig);
      });
      seccion.hidden = false;
    }

    var enlaces = document.querySelectorAll("[data-formulario]");
    for (var i = 0; i < enlaces.length; i++) {
      if (D.formularioTestimonios) {
        enlaces[i].href = D.formularioTestimonios;
        enlaces[i].target = "_blank";
        enlaces[i].rel = "noopener";
      } else {
        var aviso = pendiente("enlace del formulario de testimonios");
        enlaces[i].parentNode.replaceChild(aviso, enlaces[i]);
      }
    }
  }

  /* ---------- datos estructurados para Google (eventos) ---------- */

  function datosEstructurados() {
    var destino = document.querySelector("[data-jsonld='eventos']");
    if (!destino) return;
    var base = (D.dominio || "").replace(/\/$/, "");
    var vigentes = fechasVigentes();
    if (!vigentes.length) return;

    var eventos = vigentes.map(function (x) {
      var inicio = new Date(x.fecha + "T" + T.horaInicio + ":00-05:00");
      var fin = new Date(inicio.getTime() + T.duracionHoras * 3600000);
      function iso(d) {
        // formato con -05:00 (hora de Bogotá)
        var l = new Date(d.getTime() - 5 * 3600000).toISOString().slice(0, 19);
        return l + "-05:00";
      }
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": T.nombre,
        "description": "Caminata guiada con atención plena en el " + T.lugar +
          ". Meditaciones por audífono individual, ejercicios sencillos y conocimiento del entorno natural.",
        "startDate": iso(inicio),
        "endDate": iso(fin),
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": T.lugar,
          "address": { "@type": "PostalAddress", "addressLocality": "Bogotá", "addressCountry": "CO" }
        },
        "image": [base + "/img/compartir.jpg"],
        "organizer": { "@type": "Organization", "name": "Solmaranto", "url": base || undefined },
        "offers": {
          "@type": "Offer",
          "price": String(T.precio),
          "priceCurrency": "COP",
          "availability": x.estado === "agotado" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          "url": base + "/taller.html"
        }
      };
    });

    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(eventos);
    document.head.appendChild(s);
  }

  /* ---------- Google Analytics 4 (apagado hasta tener ID) ---------- */

  function analitica() {
    var id = D.analyticsId;
    if (!id) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id);
  }

  /* ---------- arranque ---------- */

  function iniciar() {
    rellenarDatos();
    pintarFechas();
    pintarTestimonios();
    conectarBotonesWhatsApp(); // después de pintar, porque las fechas crean botones
    datosEstructurados();
    analitica();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
