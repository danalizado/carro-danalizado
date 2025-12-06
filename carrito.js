// ============================================
// 1. MODELO DE DATOS COMPLETO
// ============================================

const productos = [
    // --- CURSOS (Fútbol) ---
    { id: 'curso-f-int', nombre: 'Curso: Video Análisis Integral (Fútbol)', precio: 250000 },
    { id: 'curso-f-dron', nombre: 'Curso: Uso de Dron (Fútbol)', precio: 100000 },
    { id: 'curso-f-tact', nombre: 'Curso: Análisis Táctico (Fútbol)', precio: 150000 },
    { id: 'curso-f-scout', nombre: 'Curso: Scouting (Fútbol)', precio: 200000 },
    { id: 'curso-f-estr', nombre: 'Curso: Estrategia Operativa (Fútbol)', precio: 200000 },
    { id: 'curso-f-long', nombre: 'Curso: Longomatch Premium (Fútbol)', precio: 150000 },
    { id: 'curso-f-p.p', nombre: 'Curso: Análisis de la Pelota Parada (Fútbol)', precio: 100000 },
    
    // --- CURSOS (Otros Deportes) ---
    { id: 'curso-r-int', nombre: 'Curso: Video Análisis Integral (Rugby)', precio: 250000 },
    { id: 'curso-h-int', nombre: 'Curso: Video Análisis Integral (Hockey)', precio: 250000 },
    { id: 'curso-t-int', nombre: 'Curso: Video Análisis Integral (Tenis)', precio: 250000 },

    // --- SERVICIOS ---
    { id: 'serv-analisis', nombre: 'Servicio: Análisis de Rendimiento (Deporte a elegir)', precio: 100000 },
    { id: 'serv-informe', nombre: 'Servicio: Informes Premium (Deporte a elegir)', precio: 150000 },
    { id: 'serv-video-p', nombre: 'Servicio: Videos Personalizados (Deporte a elegir)', precio: 105000 },
];

let carrito = [];


// ============================================
// 2. FUNCIONES DE UTILIDAD
// ============================================

function obtenerProductoPorId(id) {
    return productos.find(producto => producto.id === id);
}

function calcularTotal() {
    let total = 0;
    for (const itemId of carrito) {
        const item = obtenerProductoPorId(itemId);
        if (item) {
            total += item.precio;
        }
    }
    return total;
}

// ============================================
// 3. FUNCIONES DE MANEJO DEL CARRITO
// ============================================

function agregarAlCarrito(productoId) {
    carrito.push(productoId);
    localStorage.setItem('carritoDeporteAnalizado', JSON.stringify(carrito));
    actualizarCarritoUI();
}

function eliminarDelCarrito(productoId) {
    const indice = carrito.indexOf(productoId);
    
    if (indice !== -1) {
        carrito.splice(indice, 1); 
        localStorage.setItem('carritoDeporteAnalizado', JSON.stringify(carrito));
        actualizarCarritoUI();
    }
}


/**
 * Actualiza la lista de items, el total y la visibilidad de los botones de pago.
 */
function actualizarCarritoUI() {
    // 1. OBTENER REFERENCIAS DE LOS ELEMENTOS HTML
    const listaUI = document.getElementById('lista-items-carrito');
    const totalUI = document.getElementById('carrito-total');
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    const contadorUI = document.getElementById('carrito-contador'); 
    const opcionesPagoUI = document.getElementById('opciones-pago-contenedor'); 
    

    // 2. LÓGICA DE DIBUJO DE LA LISTA
    if (listaUI) {
        listaUI.innerHTML = ''; 
    
        const itemsContados = {};
        carrito.forEach(id => {
            itemsContados[id] = (itemsContados[id] || 0) + 1;
        });
        
        for (const id in itemsContados) {
            const item = obtenerProductoPorId(id);
            const cantidad = itemsContados[id];
            
            if (item) {
                const li = document.createElement('li');
                li.classList.add('item-en-carrito'); 
                li.innerHTML = `
                    <div class="item-info">
                        <span class="item-nombre">${item.nombre}</span>
                        <span class="item-cantidad-precio">(x${cantidad} @ $${item.precio.toFixed(2)})</span>
                    </div>
                    <div class="item-acciones">
                        <span class="item-subtotal">$${(item.precio * cantidad).toFixed(2)} </span>
                        <button 
                            class="btn-eliminar-item" 
                            onclick="eliminarDelCarrito('${id}')"
                            aria-label="Eliminar ${item.nombre}"
                        >
                            ✕
                        </button>
                    </div>
                `;
                listaUI.appendChild(li);
            }
        }

        // 3. Actualizar el total y la visibilidad de los botones
        if (totalUI && btnFinalizar) {
            const total = calcularTotal();
            totalUI.textContent = `$${total.toFixed(2)}`;
            
            if (total > 0) {
                btnFinalizar.style.display = 'block'; 
            } else {
                btnFinalizar.style.display = 'none'; 
            }
        }
    }

    // 🛑 LÓGICA DE OCULTAMIENTO DE CONTENEDORES DE PAGO AL ACTUALIZAR EL CARRITO 🛑
    if (opcionesPagoUI) opcionesPagoUI.style.display = 'none';


    // 4. LÓGICA DE ACTUALIZACIÓN DEL CONTADOR (Header)
    if (contadorUI) {
        contadorUI.textContent = carrito.length; 
        if (carrito.length > 0) {
            contadorUI.classList.remove('contador-vacio'); 
        } else {
            contadorUI.classList.add('contador-vacio'); 
        }
    }
}


// ============================================
// 4. FINALIZAR COMPRA (Muestra las opciones con Logos/Links)
// ============================================

/**
 * Cuando se presiona el botón principal, oculta ese botón y muestra las opciones con logos.
 */
function finalizarCompra() {
    const total = calcularTotal();
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    const opcionesPagoUI = document.getElementById('opciones-pago-contenedor');

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Por favor, añade productos antes de pagar.");
        return;
    }

    // Oculta el botón principal y muestra las 3 opciones de pago (LINKS)
    if (opcionesPagoUI && btnFinalizar) {
        btnFinalizar.style.display = 'none';
        opcionesPagoUI.style.display = 'flex'; // O 'block'

        alert(`El total a pagar es $${total.toFixed(2)}. Serás redirigido al sitio de pago al seleccionar una opción.`);
    }
}


// ============================================
// 5. INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intentar recuperar el carrito de la sesión anterior (LocalStorage)
    const carritoGuardado = localStorage.getItem('carritoDeporteAnalizado');
    
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
    // IMPORTANTE: Llamar aquí para que el contador, la lista y los botones se carguen al inicio.
    actualizarCarritoUI();
    
    // 2. Asignar la función de finalizar compra al botón principal
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
    
    // 🛑 SE ELIMINA LA LÓGICA DE PAYPAL QR DE AQUÍ 🛑

});