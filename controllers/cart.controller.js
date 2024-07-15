import { cartService } from "../services/cart-service.js";
import { cookieService } from "../services/cookie-service.js";
import { priceService } from "../services/formatPrice-service.js";
import { modalService } from "../services/modal-service.js";
import { productService } from "../services/product-service.js";
import { securityService } from "../services/security-service.js";


//====================================================== Configuracion básica========================================================
//Haciendo funcionar el menú desplegable
let menuIcon = document.getElementById("menu-icon");
menuIcon.addEventListener("click", () => {
    let menu = document.getElementById("menu");
    menu.classList.toggle("active");
}) 

//Para hacer funcionar el input de cantidad
let valoresInicialesProductos = [];
let valorTotalInicial = 0;

window.onload = () => {
    //Verificando cuenta
    securityService.verificarSesionDeCuenta();

    // Preparando modal
    modalService.modalStart();
    
    if(cookieService.getCookie("ag_user_id") !== null){
        let idproductos = cartService.obtenerProductos()

        let cartProducts = document.querySelector(".cart-products");
        
        if(idproductos == null){
            cartProducts.removeChild(document.querySelector("#load-image"));
            return cartProducts.innerHTML = "<h2>No hay productos en el carrito</h2>"
        }
        
        let breadcrum = `<div class="breadcrum">
        <h2>Carrito</h2>
        <span bc-cant>${idproductos.length} product${idproductos.length > 1 ? "os" : "o"}</span>
        </div>`;

        if(cookieService.getCookie("ag_carrito_productos") == ""){
            cartProducts.removeChild(document.querySelector("#load-image"));
            return cartProducts.innerHTML = "<h2>No hay productos en el carrito</h2>"
        }
        
        //Eliminar imagen de carga
        cartProducts.removeChild(document.querySelector("#load-image"));
        
        cartProducts.classList.remove("centered")

        //Meter el Breadcrum con la cantidad de productos
        cartProducts.innerHTML = breadcrum;

        let totalValue = 0;

        idproductos.forEach(async (producto, i) => {
            let data = await productService.productoPorId(producto)

            let product = data[0];
            let productPrice = priceService.priceValueManager(product);
            let productoPrecio;

            //Definiendo el valor para hacer una suma del total, por lo que se requiere que sean numeros
            if(product.descuento > 0 && product.descuento < 99){
                productoPrecio = product.precio - ((product.precio * product.descuento) / 100);
            }else{
                productoPrecio = product.precio;
            }

            totalValue = totalValue + productoPrecio;

            //Guardando cantidades iniciales de productos
            valoresInicialesProductos.push({cantidad:1, id:product.id})

            //Guardando el valor total inicial
            valorTotalInicial = totalValue;

            let tvFormat = priceService.formatPrice(totalValue);

            let productHTML =  `<div class="cart-product">
                                    <div class="cart-product-desc">
                                        <img src="assets/image/${product.imagen}" alt="Imagen del producto: ${product.nombre}">
                                        <a href="producto.html?id=${product.id}" style="text-decoration: none; color: var(--textAlt);"><h2>${product.nombre}</h2></a>
                                    </div>
                                    <div class="cart-product-info" id="ci${product.id}">
                                        <span class="cart-price">${productPrice.precio}</span>
                                        <input type="number" name="quantity" idp="${product.id}" valueproduct="${productoPrecio}" class="cart-quantity" value="1" min="1" max="9" quantity="true">
                                        <button delid="${product.id}"><i delid="${product.id}" class="bx bx-trash" style="color: red; font-size: 24px;"></i></button>
                                    </div>
                                </div>`;
            
            //Meter productos
            cartProducts.innerHTML = cartProducts.innerHTML+productHTML;

            //Haciendo que el input de cantidad funcione
            let quantityInput = document.querySelector("[idp='"+product.id+"']")

            let btndelete = document.querySelector("[delid='"+product.id+"']")
            
            window.addEventListener('click', function(e){
                if(btndelete.getAttribute("delid") ==  e.target.getAttribute("delid") && e.target.getAttribute("delid") == product.id){
                    e.preventDefault()
                    let confirmar = confirm("¿Quieres eliminar este producto del carrito?")
                    
                    if(confirmar == true){
                        let cartProd = document.querySelector("[id='ci"+product.id+"']").parentElement;
                        
                        //Obteniendo productos del carrito
                        let data = cookieService.getCookie("ag_carrito_productos")
                        let productos = data.split(",")
                        
                        //Hallando la ID del producto a eliminar para retirarla del listado del carrito
                        for (let index = 0; index < productos.length; index++) {
                            if(Number(productos[index]) == product.id){
                                productos.splice(index, 1)
                                //Actualizando el carrito
                                cookieService.setCookie("ag_carrito_productos", productos.join(","), 365)                      
                                break
                            }
                        }
                        
                        //Actualizar la cantidad indicada en el breadcrum
                        let cant = productos.length;
                        let texto = cant > 1 ? cant + " productos" : cant + " producto";
                        document.querySelector("[bc-cant]").textContent = texto;

                        //Actualizar el valor del total
                        for (let index = 0; index < valoresInicialesProductos.length; index++) {
                            const element = valoresInicialesProductos[index];
                            if(element.id == product.id){
                                let quantityValue = document.querySelector("[idp='"+e.target.getAttribute("delid")+"']")

                                let totalActualizado = priceService.formatPrice(valorTotalInicial - (quantityValue.value * productoPrecio));
                                
                                valoresInicialesProductos.splice(index, 1) // Retirando el producto del listado del carrito

                                valorTotalInicial = valorTotalInicial - (quantityValue.value * productoPrecio); //actualizando total

                                document.querySelector("#cart-total").innerHTML = `<b>TOTAL: ${totalActualizado}</b>`;
                                break
                            }
                        }
                        
                        //Removiendo item de la lista en el HTML
                        cartProd.remove()
                        alert("Producto eliminado del carrito")
                        
                        //Para identificar cuando el carrito se ha vaciado
                        if(cookieService.getCookie("ag_carrito_productos") == ""){
                            //Removiendo elementos
                            let bc = document.querySelector(".breadcrum");
                            let cartP = document.querySelector(".cart-total");
                            bc.remove()
                            cartP.remove()
                            
                            //Indicando que no hay productos
                            cartProducts.classList.add("centered")
                            return cartProducts.innerHTML = "<h2>No hay productos en el carrito</h2>"
                        }
                    }
                }
            })
            
            window.addEventListener('change', function(e){
                if(quantityInput.getAttribute("idp") == e.target.getAttribute("idp")){
                    e.target.setAttribute("disabled", true)

                    //Obteniendo cantidad para actualizar el total
                    let cantidadAnterior = 0;
                    for (let index = 0; index < valoresInicialesProductos.length; index++) {
                        const element = valoresInicialesProductos[index];

                        if(quantityInput.getAttribute("idp") == element.id){
                            cantidadAnterior = valoresInicialesProductos[index].cantidad; 
                            valoresInicialesProductos[index].cantidad = Number(e.target.value);
                            break
                        }
                    }

                    //Obteniendo id del HTML el cual es el valor del producto
                    let valorProducto = Number(e.target.getAttribute("valueproduct"))

                    let totalValorActualizado = (valorTotalInicial - (cantidadAnterior * valorProducto) + (Number(e.target.value) * valorProducto))
                    
                    let totalFormateado = priceService.formatPrice(totalValorActualizado)
                    
                    //Actualizando valor total al actual
                    valorTotalInicial = totalValorActualizado;
                    
                    document.querySelector("#cart-total").innerHTML = `<b>TOTAL: ${totalFormateado}</b>`;

                    e.target.removeAttribute("disabled")
                }
            })
                        
            //agregar la barra del total //ademas de meter el texto base por si no hay nada
            if(i == (idproductos.length - 1)){
                let cartResume = `<div class="cart-resume">
                                        <span class="cart-total" id="cart-total"><b>TOTAL: ${tvFormat}</b></span>
                                        <span class="btn btn1" id="btn-cartBuy">Comprar</span>
                                    </div>`;

                cartProducts.innerHTML = cartProducts.innerHTML + cartResume;
                
                //Haciendo funcionar el boton de comprar
                let btnCartBuy = document.querySelector("#btn-cartBuy");

                btnCartBuy.addEventListener("click", () => {
                    let cantVer = false;

                    //Verificando si el valor es válido
                    document.getElementsByName("quantity").forEach(e => {
                        if(e.value >9){
                            cantVer = true
                        }
                    })

                    if(cantVer == true){
                        return alert("Cantidad de productos no permitida")
                    }
                    
                    //limpiar carrito
                    alert("Se ha realizado su compra!")
                    cookieService.deleteCookie("ag_carrito_productos")
                    
                    window.location = "index.html";
                }) 
            }
        }); 
    }
}; 

