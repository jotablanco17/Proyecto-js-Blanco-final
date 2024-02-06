
function losProductos() {

    // array vacio de productos--------------------------------------
    stock = []

    // clase constructora---------------------------------------------
    class productos {
        constructor(nombre, precio, id, img) {
            this.nombre = nombre;
            this.precio = precio;
            this.id = id;
            this.img = img
        }
    }

    // productos-------------------------------------------------
    stock.push(new productos('remera', 2400, 1, "./img/remera-basica-cuello-u-blanca-gola-marco-polo-1.jpg"))
    stock.push(new productos('pantalon', 2500, 2,"./img/pantalon-pompo-negro-tascani-marco-polo-1-600x800.jpg"))
    stock.push(new productos('camisa', 1900, 3,"./img/camisa-ochoa-negro-tascani-marco-polo-1-600x800.jpg"))
    stock.push(new productos('short', 2000, 4,"./img/short-de-bano-liso-v24-azul-airborn-marco-polo-1-600x800.jpg"))
    stock.push(new productos('jean', 6000, 5,"./img/jean-relax-tarantula-celeste-tascani-marco-polo-1-600x800.jpg"))
    stock.push(new productos('zapatillas', 10000, 6,"./img/zapatillas-foxi-negro-tascani-marco-polo-1.jpg"))
    stock.push(new productos('bermuda', 1500, 7, "./img/bermuda-manfred-gris-claro-lotus-marco-polo-1-600x800.jpg"))
    stock.push(new productos('buzo', 2000, 8, "./img/campera-bomber-gabardina-negro-airborn-marco-polo-1-600x800.jpg"))
    stock.push(new productos('chomba', 2500, 9,"./img/chomba-ancla-azul-marino-airborn-marco-polo-1-600x800.jpg"))
    stock.push(new productos('jogger', 1500, 10,"./img/jogger-petrasso-negro-tascani-marco-polo-1-600x800.jpg" ))
    stock.push(new productos('saco', 5500, 11,"./img/saco-gazman-plus-beige-tascani-marco-polo-1-600x800.jpg" ))
    stock.push(new productos('sweater', 2500, 12,"./img/sweater-beeches-negro-birmingham-marco-polo-1-600x800.jpg" ))
    console.log(stock)


    // crear un div por cada uno-------------------------------------
    for (const producto of stock) {
        let contenedor = document.createElement('main');
        contenedor.classList.add('col-3'); // Utiliza las clases de Bootstrap para definir el ancho del contenedor
        
        // Agrega la estructura HTML de la tarjeta
        contenedor.innerHTML = `
        <div class="card">
            <img src="${producto.img}" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">$${producto.precio}</p>
                <button id="${producto.id}" class ="btn btn-primary" > Agregar al carrito </button>
            </div>
        </div>`;
        
        document.body.append(contenedor);
    }
    


    // array de carrito----------------------------
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let botones = document.getElementsByClassName('btn')



    // agregar al carrito
    for (const boton of botones) {
        boton.onclick = () => {
            let productoSeleccionado = stock.find((el) => el.id === parseInt(boton.id))
            Swal.fire({
                title: `¿Quiere agregar el producto al carrito? `,
                text: ` PRODUCTO : ${productoSeleccionado.nombre} ,   PRECIO : ${productoSeleccionado.precio}`,
                icon: 'success',
                confirmButtonText: 'okey',
                showCancelButton: true,
            }).then((agregar) => {
                if (agregar.isConfirmed) {
                    carrito.push(productoSeleccionado)
                    console.log(carrito)
                    localStorage.setItem('carrito', JSON.stringify(carrito))
                    Toastify({
                        text: `se agrego ${productoSeleccionado.nombre}`,
                        duration: 1900,
                        gravity: 'bottom'
                    }).showToast()
                    actualizarContadorCarrito();

                }
                else {
                    Swal.fire('no se agrego el producto',)
                }
                // implemento librerias al boton------------------------------
            })
        }
    }

    function actualizarContadorCarrito() {
        let contador = document.querySelector('.contador');
        contador.innerHTML = carrito.length.toString();
    }

    function logoCarrito() {
        let logoCarro = document.querySelector('.logocarro');
        let carritoProductosDiv = document.querySelector('.carritoProductos');
        logoCarro.onclick = () => {
            if (carrito.length === 0) {
                Swal.fire('Carrito Vacío', 'no hay productos en el carrito', 'info');
                return;
            }
            const carritoLocalStorage = JSON.parse(localStorage.getItem('carrito'));
            // Limpiar el contenido anterior
            carritoProductosDiv.innerHTML = '';

            carritoLocalStorage.forEach((producto) => {
                const productoDiv = document.createElement('div');
                productoDiv.textContent = `${producto.nombre} - Precio: $${producto.precio}`;
                carritoProductosDiv.appendChild(productoDiv);
            });

            Swal.fire({
                title: 'Productos en el carrito',
                html: carritoProductosDiv.innerHTML,
                icon: 'success',
            });
        };
    }
    logoCarrito();


    function calcularPrecioTotal(carrito) {
        let precioTotal = 0;
        carrito.forEach(producto => {
            precioTotal += producto.precio;
        });
        return precioTotal;
    }

    function carritovacio() {
        if (carrito.length === 0) {
            Swal.fire('Carrito Vacío', 'No puedes finalizar la compra porque no hay productos en el carrito', 'info');
            return;
        }
    }

    // boton finalizar compra-----------------------------------
    let terminarCompra = document.querySelector('#finalizarCompra')
    document.body.append(terminarCompra);

    // terminar compra, limpiar local storage y limpiar carrito-----------------------------------
    terminarCompra.onclick = () => {
        const carritoLocalStorage = JSON.parse(localStorage.getItem('carrito'));
        carritovacio()
        const nombreProductos = carritoLocalStorage.map(e => e.nombre);
        const precioTotal = calcularPrecioTotal(carritoLocalStorage);

        let productosHtml = '';
        for (const nombreProducto of nombreProductos) {
            productosHtml += `<p>${nombreProducto} </p>`;
        }

        Swal.fire({
            title: `¿Desea finalizar la compra con ${nombreProductos.length} productos?`,
            html: `<p>Productos:</p>${productosHtml}<p>Precio Total: $${precioTotal}</p>`,
            icon: 'success',
            confirmButtonText: 'Sí',
            showCancelButton: true,
        }).then(aviso => {
            if (aviso.isConfirmed) {
                localStorage.clear(); // Eliminar el carrito del local storage
                carrito = []; // Limpiar el carrito
                actualizarContadorCarrito();
                Toastify({
                    text: `¡Se confirmó la compra con éxito!`,
                    duration: 2000,
                    gravity: 'bottom'
                }).showToast();
            } else {
                Swal.fire('No se finalizó la compra');
            }
        });
    };


}

// ingreso a la pagina y ser mayor de edad para comprar-------------------------------------------
function solicitarEdad() {
    Swal.fire({
        title: 'Ingrese su edad para ingresar a la pagina',
        input: 'number',
        inputLabel: 'Edad:',
        showCancelButton: true,
        confirmButtonText: 'Verificar',
    }).then((result) => {
        let spinner = document.getElementById('spinner')
        let cargando = document.getElementById('cargando')
        if (result.isConfirmed) {
            const edadIngresada = parseInt(result.value);
            if (edadIngresada >= 18) {
                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    text: 'Eres mayor de edad. ¡Acceso permitido!',
                });
                setTimeout(() => {
                    spinner.style.display = 'none'
                    cargando.style.display = 'none'
                    let elboton = document.querySelector('#finalizarCompra')
                    elboton.style.display = 'block'
                    losProductos()
                }, 2000);
                spinner.style.display = 'block'
                cargando.style.display = 'block'

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso denegado',
                    text: 'Lo siento, debes ser mayor de edad para acceder.',
                });
                ;
            }
        }

    });
}
solicitarEdad();



