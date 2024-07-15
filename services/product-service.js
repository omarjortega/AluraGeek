//URL base
const url = "http://localhost:3000/";
const controller = "productos";


const ListaProductos = () => fetch(url+controller).then((response) => response.json()).catch((err) => console.log(err));

const productoPorId = (id) => fetch(url+controller+"?id="+id).then(response => response.json()).catch(err => console.log(err));

const agregarProducto = ({nombre, marca, tipo, precio, descuento, imagen, descripcion}) => {
    //Creando ID unica
    let id = new Date().getTime()

    return fetch(url+controller, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({id, nombre, marca, tipo, precio, descuento, imagen, descripcion})
    })
}

const actualizarProducto = (id, producto) => {
    return fetch(url+controller+"/"+id, {
        method:"PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(producto)
    }).catch(err => console.log(err))
}

const eliminarProducto = (id) => {
    return fetch(url+controller+"/"+id, {
        method:"DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(err => console.log(err))
}

export const productService = {
    ListaProductos,
    productoPorId,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
}