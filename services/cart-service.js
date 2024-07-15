import { cookieService } from "./cookie-service.js";


const agregarAlCarrito = async (id, lanzarAlertas) => {
    //Verificar si se quiere lanzar alertas
    if(lanzarAlertas == undefined || lanzarAlertas == false){
        lanzarAlertas = false;
    }
    
    //Obtener los productos ya agregados al carrito, si los hay
    let productosEnCarrito = cookieService.getCookie("ag_carrito_productos");
        
    let productoLista;//Esta variable almacenara el listado de productos
    
    //Verificar si hay o no productos en el carrito
    if(productosEnCarrito == undefined || productosEnCarrito == "" || productosEnCarrito == null){
        productoLista = id;
    }else{
        productoLista = productosEnCarrito.split(",")
        
        //Verificando si el producto ya esta agregado
        if(productoLista.includes(id) == true && lanzarAlertas == true){
            return alert("Este producto ya esta agregado en tu carrito")
        }else{
            if(productoLista.includes(id) == true){
                return;
            }
        }
        
        //Volviendo a unir el listado de productos en un string para luego agregar el id
        productoLista = productoLista.join(",");
        productoLista = productoLista+","+id;
    }
    
    //Agregando productos al carrito
    cookieService.setCookie("ag_carrito_productos", productoLista, 365);
    if(lanzarAlertas == true){
        alert("Producto agregado!")
    }
}

const obtenerProductos = () => {
    const data = cookieService.getCookie("ag_carrito_productos");
    
    if(data !== null){
        let idProductos = data.split(",");
        return idProductos;
    }else{
        return null;
    }
}

export const cartService = {
    agregarAlCarrito,
    obtenerProductos,
}