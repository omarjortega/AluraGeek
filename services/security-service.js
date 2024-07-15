import { cookieService } from "./cookie-service.js";
import { modalService } from "./modal-service.js";

//URL base
const url = "http://localhost:3000/";
const controller = "usuarios";
const userId = cookieService.getCookie("ag_user_id");

const verificarSesionDeCuenta = async (incluirVerificacionDeRol) => {
    const data = await fetch(url+controller+"?id="+userId).then((response) => response.json()).catch(err => console.error(err))

    let menuActions = document.querySelector(".menu-actions");
    if(data[0] === undefined && userId == undefined ){
        //Ninguna cuenta ha iniciado sesion
        // console.log("Cuenta no ingresada")

        // Boton del login para abrir modal
        let btnLogin = document.createElement("button");
        btnLogin.classList.add("btn", "btn1");
        btnLogin.id = "btn-login";
        btnLogin.textContent = "Login";

        btnLogin.addEventListener("click", (e) => {
            modalService.modalLogin(e);
        })  

        //Agregando boton de login
        menuActions.appendChild(btnLogin);
    }else{
        if(data[0] !== undefined){
            //Cuenta ingresada que tiene una ID que si coincide con una cuenta registrada
            // console.log("Cuenta ingresada verificada")

            // Boton de cerrar sesion
            let btnSalir = document.createElement("button");
            btnSalir.classList.add("btn", "btn1");
            btnSalir.id = "btn-logout";
            btnSalir.textContent = "Cerrar sesion";

            btnSalir.addEventListener("click", () => {
                securityService.cerrarSesion()
            })  

            menuActions.appendChild(btnSalir)

            //Verificar si el usuario puede acceder o no a caracteristicas de administrador, solo si se requiere verificar
            if(incluirVerificacionDeRol === true && data[0].rol === 1){
                menuActions.removeChild(document.querySelector("[href='cart.html']"))

                let btnAddProd = document.createElement("button")
                btnAddProd.classList.add("btn", "btn1")
                btnAddProd.textContent = "Agregar producto";

                btnAddProd.addEventListener("click", (e) => {
                    modalService.modalProductAdd(e)
                })

                document.querySelector(".add-product").appendChild(btnAddProd)
            }

            //Controlar que si se requiere verificar el rol, la cuenta tenga ese rol, sino mandara alerta
            if(incluirVerificacionDeRol === true && data[0].rol !== 1)
            {
                // console.log("Esta cuenta no puede acceder a las caracteristicas de admin")
            }
        }else{
            //Cuenta que inicio sesion tiene una ID no identificada
            // console.log("Cuenta ingresada no verificada")
            cerrarSesion("La cuenta tiene una ID no identificada, vuelva a iniciar sesion")
        }
    }
}

const cerrarSesion = (mensaje) => {
    if(mensaje !== undefined){
        alert(mensaje)
    }

    cookieService.deleteCookie("ag_user_id");
    cookieService.deleteCookie("ag_user_role");

    cookieService.deleteCookie("ag_carrito_productos");

    window.location = "index.html"
}

//Este método verifica si la id indicada
const verificarId = () => fetch(url+controller+"?id="+userId).then(response => response.json()).catch(err => console.log(err));


export const securityService = {
    verificarSesionDeCuenta,
    verificarId,
    cerrarSesion
}