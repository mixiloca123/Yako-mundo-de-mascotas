
        let carrito = [];
        let cuentaTotal = 0;
        let cantidadProductos = 0;

        window.onload = function() {
            const memoria = localStorage.getItem('carritoYako');
            if (memoria) {
                carrito = JSON.parse(memoria);
                actualizarTodo();
            }
        };

        function guardarMemoria() {
            localStorage.setItem('carritoYako', JSON.stringify(carrito));
            actualizarTodo();
        }

        function actualizarTodo() {
            cuentaTotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
            cantidadProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
            
            document.getElementById('count').innerText = cantidadProductos;
            document.getElementById('total').innerText = cuentaTotal.toLocaleString('es-CO');
            
            const modal = document.getElementById('modal-carrito');
            if(modal.style.display === 'flex') {
                actualizarModal();
            }
        }

        function ajustarCant(btn, cambio) {
            const input = btn.parentElement.querySelector('.input-cant');
            let valor = parseInt(input.value) + cambio;
            if (valor < 1) valor = 1;
            input.value = valor;
        }

        function sumarPedido(nombre, precio, btn) {
            const input = btn.parentElement.querySelector('.input-cant');
            const cantidad = parseInt(input.value);
            const imagen = btn.closest('.producto-card').querySelector('.producto-img img').src;
            
            const index = carrito.findIndex(item => item.nombre === nombre);
            if (index > -1) {
                carrito[index].cantidad += cantidad;
            } else {
                carrito.push({ nombre, precio, imagen, cantidad });
            }
            
            guardarMemoria();
            input.value = 1;
            alert("Producto añadido al carrito");
        }

        function toggleCart() {
            const modal = document.getElementById('modal-carrito');
            modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
            if (modal.style.display === 'flex') actualizarModal();
        }

        function actualizarModal() {
            const lista = document.getElementById('lista-carrito');
            lista.innerHTML = '';
            
            carrito.forEach((prod, index) => {
                lista.innerHTML += `
                    <div class="item-carrito">
                        <img src="${prod.imagen}">
                        <div style="flex:1">
                            <strong>${prod.nombre}</strong><br>
                            ${prod.cantidad} x $${prod.precio.toLocaleString('es-CO')}
                        </div>
                        <button onclick="eliminarItem(${index})" style="border:none; background:none; color:red; cursor:pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`;
            });
            document.getElementById('total-modal').innerText = cuentaTotal.toLocaleString('es-CO');
        }

        function eliminarItem(index) {
            carrito.splice(index, 1);
            guardarMemoria();
        }

        function vaciarCarrito() {
            if(confirm("¿Vaciar todo el pedido?")) {
                carrito = [];
                guardarMemoria();
            }
        }

        function enviarWhatsApp() {
            if(carrito.length === 0) return alert("El carrito está vacío");
            
            let mensaje = "¡Hola Yako Mundo Mascotas! Quiero este pedido de la sección Perros:%0A%0A";
            carrito.forEach(item => {
                mensaje += `• ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toLocaleString('es-CO')}%0A`;
            });
            mensaje += `%0A*TOTAL: $${cuentaTotal.toLocaleString('es-CO')}*`;
            mensaje += `%0A%0AMétodo de pago preferido: (Nequi/Daviplata/Llave/Efectivo)`;
            
            window.open(`https://wa.me/573224022039?text=${mensaje}`, '_blank');
        }

        function ejecutarBusqueda() {
            const q = document.getElementById('mainSearch').value;
            if(q.trim() !== "") {
                alert("Buscando en catálogo: " + q);
            }
        }
    