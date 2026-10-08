/* ==========================================================================
   SOLMARANTO · ARCHIVO ÚNICO DE DATOS
   --------------------------------------------------------------------------
   Todo lo que cambia con frecuencia está aquí. No necesitas tocar nada más.

   REGLAS PARA EDITAR (importante):
   - Cambia solo lo que está entre comillas "así" o los números.
   - No borres las comas (,) ni las llaves { } ni los corchetes [ ].
   - Guarda el archivo y vuelve a subirlo. El sitio se actualiza solo.

   RECETAS RÁPIDAS
   · Marcar una fecha como AGOTADA: en la lista "fechas", cambia
     estado: "disponible"  por  estado: "agotado"  en esa fecha.
   · Agregar una fecha nueva: copia una línea de la lista "fechas", pégala
     debajo y cambia el día. Formato de la fecha: AÑO-MES-DÍA (2026-12-05).
   · Cambiar el precio: modifica "precio" (solo números, sin puntos).
   · Cambiar la hora: modifica "hora" (como se lee) y "horaInicio" (formato
     de 24 horas, por ejemplo "09:00" o "14:30").
   · Una fecha que ya pasó deja de mostrarse sola. No tienes que borrarla.
   ========================================================================== */

window.SOLMARANTO = {

  /* ---------- CONTACTO ---------- */

  // Número de WhatsApp: solo dígitos, con el 57 de Colombia al inicio.
  // Ejemplo: "573001234567". Mientras esté vacío ("") el sitio muestra
  // el aviso [PENDIENTE: WhatsApp].
  whatsapp: "",

  instagram: "solmaranto",              // sin el @
  correo: "solmaranto21@gmail.com",
  rnt: "231896",                        // Registro Nacional de Turismo
  guia: "Gina Grisales Serna",

  /* ---------- SITIO ---------- */

  // Se completa al publicar, cuando ya tengas dominio. Ejemplo: "https://solmaranto.com"
  dominio: "",

  // Google Analytics 4. Mientras esté vacío ("") no se carga nada.
  // Cuando tengas el ID, pégalo aquí. Ejemplo: "G-ABC123XYZ9"
  analyticsId: "",

  // Enlace del formulario de Google para que tus amigos dejen su comentario.
  // Mientras esté vacío, el sitio muestra el aviso [PENDIENTE: formulario].
  formularioTestimonios: "",

  /* ---------- EL TALLER ---------- */

  taller: {
    nombre: "Un paseo con los sentidos",
    lugar: "Jardín Botánico de Bogotá",
    hora: "9:00 a. m.",       // como se lee en pantalla
    horaInicio: "09:00",      // formato 24 horas (para Google)
    duracion: "3 horas",      // como se lee en pantalla
    duracionHoras: 3,         // solo el número (para Google)
    cupos: 10,                // cupos por fecha
    precio: 80000,            // en pesos colombianos, sin puntos
    notaPrecio: "Precio de lanzamiento, válido para estas cuatro fechas"
  },

  /* ---------- FECHAS ----------
     estado: "disponible"  → se muestra con cupos y botón de reserva
     estado: "agotado"     → se muestra como agotada y sin botón           */

  fechas: [
    { fecha: "2026-10-17", estado: "disponible" },
    { fecha: "2026-10-24", estado: "disponible" },
    { fecha: "2026-11-07", estado: "disponible" },
    { fecha: "2026-11-14", estado: "disponible" }
  ],

  /* ---------- TESTIMONIOS ----------
     Mientras esta lista esté vacía [], la sección no se muestra.
     Para agregar uno aprobado, copia un bloque { ... }, pégalo dentro de
     la lista (separado por coma) y llena los datos. Ejemplo:

       { nombre: "Ana", comentario: "Texto que ella autorizó publicar." },
  */

  testimonios: [
  ]
};
