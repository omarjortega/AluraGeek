import { loginService } from "./login-service.js";
import { cookieService } from "./cookie-service.js";
import { productService } from "./product-service.js";

// Funcion para preparar modal
const modalStart = () => {
    // Obteniendo el body
    let body = document.getElementsByTagName("body");

    //Creando divisiones
    let modalContainer = document.createElement("div");
    let modalContent = document.createElement("div");

    //Asignando clases
    modalContainer.classList.add("container-modal");
    modalContent.classList.add("content-modal");

    //Asignando ID
    modalContainer.id = "modal-container";
    modalContent.id = "modal-body";

    //Uniendo divisiones
    modalContainer.appendChild(modalContent);

    // Agregando modal al body
    body[0].appendChild(modalContainer);
}


// Funciones para abrir diferentes modals
const modalLogin = (e) => {
    e.preventDefault();
    let modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `<form action="" id="formLogin">
                                <div class="form-head">
                                    <h2>Iniciar sesion</h2>
                                    <span class="close-icon" id="btn-close"><i class="bx bx-x"></i></span>
                                </div>
                                
                                <div class="form-control">
                                    <label for="usuario">Usuario</label>
                                    <input class="form-control" type="text" name="usuario" id="usuario" required>
                                </div>
                                
                                <div class="form-control">
                                    <label for="contraseña">Contraseña</label>
                                    <input class="form-control" type="password" name="contraseña" id="contraseña" required>
                                </div>
                                
                                <div class="btn-cerrar">
                                    <button type="submit" class="btn btn-modal">Ingresar</button> 
                                </div>
                            </form>`

    modalToggle();

    
    // Agregando método para el formulario del login
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const data = await loginService.iniciarSesion(document.querySelector("#usuario").value)

        let userFinded = false;

        for (let index = 0; index < data.length; index++) {
            const usuario = data[index];
            if(document.querySelector("#contraseña").value == usuario.pass){
                userFinded = true;

                cookieService.setCookie("ag_user_id", usuario.id, 365);
                cookieService.setCookie("ag_user_role", usuario.rol, 365);

                alert("Ha iniciado sesion");

                window.location = "index.html"
                
                break
            }
        }

        if(userFinded == false)
        {
            alert("Usuario o contraseña incorrecto")
        }
        
    })
}

const modalProductAdd = (e) => {
    e.preventDefault();

    if(Number(cookieService.getCookie("ag_user_role")) !== 1){
        return alert("No puede ejecutar esta caracteristica")
    }

    let modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `<form action="" id="addProdForm">
                            <div class="form-head">
                                <h2>Agregar producto</h2>
                                <span class="close-icon" id="btn-close"><i class="bx bx-x"></i></span>
                            </div>
                            
                            <div class="form-control">
                                <label for="nombre">Nombre</label>
                                <input class="form-control" type="text" name="nombre" id="nombre" required>
                            </div>

                            <div class="form-control">
                                <label for="marca">Marca</label>
                                <input class="form-control" type="text" name="marca" id="marca" required>
                            </div>
                            
                            <div class="form-control">
                                <label for="categoria">Categoria</label>
                                <input class="form-control" type="text" name="categoria" id="categoria" required>
                            </div>

                            <div class="form-control">
                                <label for="precio">Precio</label>
                                <input class="form-control" type="number" name="precio" id="precio" min="1", max="20000000" required>
                            </div>

                            <div class="form-control">
                                <label for="descuento">Descuento</label>
                                <input class="form-control" type="number" name="descuento" id="descuento" min="0", max="99" required>
                            </div>

                            <div class="form-control">
                                <label for="urlimagen">URL de imagen</label>
                                <input class="form-control" type="text" name="urlimagen" id="urlimagen" required>
                            </div>

                            <div class="form-control">
                                <label for="descripcion">Descripcion</label>
                                <textarea class="text-area" name="descripcion" id="descripcion" minlength="10" maxlength="600" required></textarea>
                            </div>
                            
                            <div class="btn-cerrar">
                                <button type="submit" class="btn btn-modal">Ingresar</button>
                            </div>
                        </form>`

    modalToggle();

    //Agregando nuevo producto 
    document.querySelector("#addProdForm").addEventListener("submit", (e) => {
        e.preventDefault()
        let formData = getFormData()

        productService.agregarProducto(formData).then(
            response => {
                alert("Producto agregado")
                modalToggle()
            }
        ).catch(err => console.log(err))
    })
}

const modalProductEdit = (e, producto) => {
    e.preventDefault();
    
    if(Number(cookieService.getCookie("ag_user_role")) !== 1){
        return alert("No puede ejecutar esta caracteristica")
    }

    let modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `<form action="" id="editProdForm">
                                <div class="form-head">
                                    <h2>Agregar producto</h2>
                                    <span class="close-icon" id="btn-close"><i class="bx bx-x"></i></span>
                                </div>
                                
                                <div class="form-control">
                                    <label for="nombre">Nombre</label>
                                    <input class="form-control" type="text" name="nombre" id="nombre" value="${producto.nombre}" required>
                                </div>

                                <div class="form-control">
                                    <label for="marca">Marca</label>
                                    <input class="form-control" type="text" name="marca" id="marca" value="${producto.marca}" required>
                                </div>
                                
                                <div class="form-control">
                                    <label for="categoria">Categoria</label>
                                    <input class="form-control" type="text" name="categoria" id="categoria" value="${producto.tipo}" required>
                                </div>

                                <div class="form-control">
                                    <label for="precio">Precio</label>
                                    <input class="form-control" type="number" name="precio" id="precio" min="1", max="20000000" value="${producto.precio}" required>
                                </div>

                                <div class="form-control">
                                    <label for="descuento">Descuento</label>
                                    <input class="form-control" type="number" name="descuento" id="descuento" min="0", max="99" value="${producto.descuento}" required>
                                </div>

                                <div class="form-control">
                                    <label for="urlimagen">URL de imagen</label>
                                    <input class="form-control" type="text" name="urlimagen" id="urlimagen" value="${producto.imagen}" required>
                                </div>

                                <div class="form-control">
                                    <label for="descripcion">Descripcion</label>
                                    <textarea class="text-area" name="descripcion" id="descripcion" required></textarea>
                                </div>

                                <input type="hidden" name="idprod" id="idprod" value="${producto.id}">
                                
                                <div class="btn-cerrar">
                                    <button type="submit" class="btn btn-modal">Ingresar</button>
                                </div>
                            </form>`

    modalToggle();
    document.querySelector("textarea").value = producto.descripcion;

    //Editando el producto
    document.querySelector("#editProdForm").addEventListener("submit", (e) => {
        e.preventDefault()

        let formData = getFormData(producto.id)

        productService.actualizarProducto(producto.id, formData).then(response => {
            alert("Producto editado")
            modalToggle()
        }).catch(err => console.log(err))
    })
}

// Funcion auxiliar, solo requerida por los métodos exportados acá
function modalToggle(){
    let closebtn = document.getElementById("btn-close");
    closebtn.onclick = modalLogin;
    let modal = document.getElementById("modal-container");
    modal.classList.toggle("toggle-modal");
}

//funcion auxiliar
function getFormData(id){
    //Obteniendo variables
    let nombre= document.querySelector("#nombre")
    let marca = document.querySelector("#marca")
    let tipo = document.querySelector("#categoria")
    let precio = document.querySelector("#precio")
    let descuento = document.querySelector("#descuento")
    let imagen = document.querySelector("#urlimagen")
    let descripcion = document.querySelector("#descripcion")
    let btnModal = document.querySelector(".btn.btn-modal")
    let idProd = {value:null};

    if(id > 0){
        idProd = document.querySelector("#idprod")
    }

    //Bloqueando inputs del formulario
    nombre.setAttribute("disabled", true)
    marca.setAttribute("disabled", true)
    tipo.setAttribute("disabled", true)
    precio.setAttribute("disabled", true)
    descuento.setAttribute("disabled", true)
    imagen.setAttribute("disabled", true)
    descripcion.setAttribute("disabled", true)
    btnModal.setAttribute("disabled", true)
    
    const data = {
        nombre: nombre.value,
        marca: marca.value,
        tipo: tipo.value,
        precio: Number(precio.value),
        descuento: Number(descuento.value),
        imagen: imagen.value,
        descripcion: descripcion.value,
        id: idProd.value
    }

    return data;
}

export const modalService = {
    modalStart,
    modalLogin,
    modalProductAdd,
    modalProductEdit
}