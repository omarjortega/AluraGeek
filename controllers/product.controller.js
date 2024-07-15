import { cookieService } from "../services/cookie-service.js";
import { priceService } from "../services/formatPrice-service.js";
import { modalService } from "../services/modal-service.js";
import { productService } from "../services/product-service.js";
import { securityService } from "../services/security-service.js";


//====================================================== Configuracion básica ========================================================
//Haciendo funcionar el menú desplegable
let menuIcon = document.getElementById("menu-icon");
menuIcon.onclick = () => {
    let menu = document.getElementById("menu");
    menu.classList.toggle("active");
}


window.onload = () => {
    //Verificando cuenta
    securityService.verificarSesionDeCuenta(true);
    
    // Preparando modal
    modalService.modalStart();

    //Obteniendo productos
    ObtenerProductos();
}; 

//====================================================== Logica del controlador ========================================================
const ObtenerProductos = async () => {
    let productos = await productService.ListaProductos();

    let userRole = Number(cookieService.getCookie("ag_user_role"))
    let listadoIdProducts = [];
    
    let cardList = document.createElement("div");
    cardList.classList.add("card-list");
    cardList.id = "card-list";
    
    for (let index = 0; index < productos.length; index++) {
        const producto = productos[index];
        
        let productPrice = priceService.priceValueManager(producto);
        
        let {precio, precioAnterior, descuento, estiloProductoSinDescuento} = productPrice;
        
        let productHTML = `<div class="card">
                                <h3 class="card-title">${producto.nombre}</h3>

                                <img src="assets/image/${producto.imagen}" alt="Imagen del equipo: ${producto.nombre}" class="card-image" id="img-${producto.id}">

                                <div class="card-pricing ${estiloProductoSinDescuento}">
                                    <span class="price-disc">${precioAnterior}</span>
                                    <span class="price">${precio} <span class="disc-per">${descuento}</span></span>
                                </div>
                                `;
        if(userRole === 1){
            productHTML = productHTML + `<button class="btn btn2" id="btn-edit-${producto.id}">Editar</button>
            <button style="background-color: transparent; border: none; margin: 15px auto 0 auto;" id="btn-del-${producto.id}"><i class="bx bx-trash" style="color: red; font-size: 24px; cursor: pointer;"></i></button>
            </div>`
        }else{
            productHTML = productHTML + `<a class="btn btn2 btn-link" href="producto.html?id=${producto.id}">Ver más</a>
            </div>`
        }

        listadoIdProducts.push(producto.id)

        cardList.innerHTML = cardList.innerHTML + productHTML;
    }
    
    //Removiendo imagen de carga y agregando cards
    let productList = document.getElementById("products");
    productList.removeChild(document.getElementById("load-image"));
    productList.appendChild(cardList);
    
    if(userRole === 1){
        for (let index = 0; index < listadoIdProducts.length; index++) {
            const idProd = listadoIdProducts[index];
            
            document.querySelector("#btn-edit-"+idProd).addEventListener("click", (e) => {
                modalService.modalProductEdit(e, productos[index])
            })
            
            document.querySelector("#btn-del-"+idProd).addEventListener("click", (e) => {
                e.preventDefault()
                let del = confirm("¿Estas seguro de que quieres eliminar este producto?")
                
                if(del == true){
                    productService.eliminarProducto(idProd).then(response => {
                        alert("Producto eliminado")
                    })
                }
            })
            
            //Controlando imagenes que fallan
            document.querySelector("#img-"+idProd).addEventListener("error", (e) => {
                e.target.setAttribute("src", "assets/image/not-found.png")
            })
        }
    }
}