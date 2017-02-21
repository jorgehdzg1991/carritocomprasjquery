var productos = [
    {
        id: 1,
        nombre: 'Samsung Galaxy S6',
        precio: 14999.90
    },
    {
        id: 2,
        nombre: 'Iphone 7',
        precio: 18500.45
    },
    {
        id: 3,
        nombre: 'Macbook Pro',
        precio: 32999.00
    },
    {
        id: 4,
        nombre: 'Asus X556UV',
        precio: 16499.99
    }
];

function Carrito() {
    if (localStorage.getItem('carrito')) {
        var json = localStorage.getItem('carrito');
        this.elementos = JSON.parse(json);
    } else {
        this.elementos = [];
    }

    this.agregar = function(id, cantidad) {
        if (id === 0) return;

        var check = false;

        this.elementos.forEach(function(elemento, indice) {
            if (elemento.id === id) {
                elemento.cantidad += cantidad;
                check = true;
            }
        });

        if (!check) {
            this.elementos.push({
                id: id,
                cantidad: cantidad
            });
        }

        this.actualizar();
    };

    this.cambiarCantidad = function(id, cantidad) {
        this.elementos.forEach(function (elemento, indice) {
            if (elemento.id === id) {
                elemento.cantidad = cantidad;
            }
        });

        this.actualizar();
    };

    this.eliminar = function(id) {
        this.elementos = this.elementos.filter(function (el) {
            return el.id !== id;
        });

        this.actualizar();
    };

    this.actualizar = function() {
        var json = JSON.stringify(this.elementos);
        localStorage.setItem("carrito", json);
    };

    this.limpiar = function() {
        this.elementos = [];
        this.actualizar();
    };
}

function eliminarProducto(id) {
    var carrito = new Carrito();
    carrito.eliminar(id);
    actualizarHtmlTabla(carrito.elementos);
}

function cambiarCantidad(e, id) {
    var cantidad = parseInt($(e.target).val());

    if (cantidad <= 0) {
        eliminarProducto(id);
    } else {
        var carrito = new Carrito();
        carrito.cambiarCantidad(id, cantidad);
        actualizarHtmlTabla(carrito.elementos);
    }
}

function actualizarHtmlTabla(elementos) {
    if (elementos.length === 0) {
        $('#tblCarrito').html('<tr><td colspan="5">No hay productos en el carrito</td></tr>');
        return;
    }

    $('#tblCarrito').html('');

    var totalCarrito = 0;

    elementos.forEach(function(elemento, indice) {
        var producto = productos.filter(function (el) {
            return el.id === elemento.id;
        })[0];

        var total = elemento.cantidad * producto.precio;
        totalCarrito += total;

        var html =
        '<tr>' +
        '   <td>' + producto.nombre + '</td>' +
        '   <td><input type="number" class="form-control" onchange="cambiarCantidad(event, ' + elemento.id + ')" min="0" value="' + elemento.cantidad + '" /></td>' +
        '   <td class="text-right">$ ' + producto.precio.toFixed(2) + '</td>' +
        '   <td class="text-right">$ ' + total.toFixed(2) + '</td>' +
        '   <td><a href="javascript:eliminarProducto(' + elemento.id + ')">Eliminar</a></td>' +
        '</tr>';

        $('#tblCarrito').append(html);
    });

    var renglonTotal =
    '<tr>' +
    '   <td colspan="3" class="text-right"><h4>TOTAL EN EL CARRITO:</h4></td>' +
    '   <td colspan="2"><h3 style="margin:0;"><label class="label label-success">$ ' + totalCarrito.toFixed(2) + '</label></h3></td>' +
    '</tr>';

    $('#tblCarrito').append(renglonTotal);
}

$(document).ready(function() {
    var carrito = new Carrito();

    $('#cmbProductos').html('<option value="0" selected="selected">Seleccione un producto</option>');

    productos.forEach(function(producto, indice) {
        $('#cmbProductos').append('<option value="' + producto.id + '">' + producto.nombre + ' - ($' + producto.precio.toFixed(2) + ')</option>');
    });

    $('#frmAgregar').submit(function (e) {
        e.preventDefault();

        var id = parseInt($('#cmbProductos').val());
        var cantidad = parseInt($('#txtCantidad').val());

        var carrito = new Carrito();

        carrito.agregar(id, cantidad);

        actualizarHtmlTabla(carrito.elementos);
    });

    actualizarHtmlTabla(carrito.elementos);
});
