/* =========================================
   NOVARA - JavaScript del sitio
   ========================================= */

const NUMERO_WHATSAPP = "573123233883";


/* ---------- PROMOCIONES ---------- */

// Al elegir una oferta, abre el formulario con esa promoción marcada
function seleccionarPromocion(nombrePromo) {
  window.location.href = "cotizacion.html?promo=" + encodeURIComponent(nombrePromo);
}

document.querySelectorAll("[data-promo]").forEach(function (boton) {
  boton.addEventListener("click", function () {
    seleccionarPromocion(boton.dataset.promo);
  });
});


/* ---------- FORMULARIO DE COTIZACIÓN ---------- */

const formulario = document.getElementById("form-cotizacion");

// Marca en una lista la opción recibida por la dirección (si existe)
function preseleccionar(idLista, valor) {
  const lista = document.getElementById(idLista);
  const existe = Array.from(lista.options).some(function (opcion) {
    return opcion.value === valor;
  });

  if (valor && existe) {
    lista.value = valor;
  }
}

// Fecha de hoy en formato AAAA-MM-DD, según la hora local
function fechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

// Los campos obligatorios no pueden quedar solo con espacios
function validarTexto(campo) {
  const vacio = campo.value !== "" && campo.value.trim() === "";
  campo.setCustomValidity(vacio ? "Completa este campo." : "");
}

// El teléfono admite números, espacios, +, guiones y paréntesis (7 a 15 dígitos)
function validarTelefono(campo) {
  const texto = campo.value.trim();
  const digitos = texto.replace(/\D/g, "").length;
  const valido = /^[0-9+()\s-]+$/.test(texto) && digitos >= 7 && digitos <= 15;

  // Si está vacío, el navegador ya avisa que el campo es obligatorio
  const sinError = campo.value === "" || valido;
  campo.setCustomValidity(sinError ? "" : "Escribe un teléfono válido. Ej: 300 123 4567");
}

function leerCampo(id) {
  return document.getElementById(id).value.trim();
}

function enviarCotizacion(event) {
  event.preventDefault();

  const mensaje = [
    "*NUEVA COTIZACIÓN*",
    "*Nombre:* " + leerCampo("nombre"),
    "*Teléfono:* " + leerCampo("telefono"),
    "*Dirección:* " + leerCampo("direccion"),
    "*Servicio:* " + leerCampo("servicio"),
    "*Promoción:* " + leerCampo("promocion"),
    "*Fecha:* " + leerCampo("fecha"),
    "*Detalles:* " + (leerCampo("detalles") || "Sin detalles")
  ].join("\n");

  const enlace = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensaje);

  window.open(enlace, "_blank");
}

if (formulario) {
  const parametros = new URLSearchParams(window.location.search);
  preseleccionar("promocion", parametros.get("promo"));
  preseleccionar("servicio", parametros.get("servicio"));

  document.getElementById("fecha").min = fechaDeHoy();

  ["nombre", "direccion"].forEach(function (id) {
    const campo = document.getElementById(id);
    campo.addEventListener("input", function () {
      validarTexto(campo);
    });
  });

  const telefono = document.getElementById("telefono");
  telefono.addEventListener("input", function () {
    validarTelefono(telefono);
  });

  formulario.addEventListener("submit", enviarCotizacion);
}
