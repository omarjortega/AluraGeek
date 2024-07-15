//URL base
const url = "http://localhost:3000/";
const controller = "usuarios";

const iniciarSesion = (usuario) => fetch(url+controller+"?user="+usuario).then(response => response.json()).catch(err => console.error(err));


export const loginService = {
    iniciarSesion,
}