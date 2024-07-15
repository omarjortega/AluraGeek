const setCookie = (name, value, daysToExpire) => {
    const date = new Date();
    date.setDate(date.getDate() + (daysToExpire * 24 * 60 * 60 * 1000))
    let expires = "expires="+date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/;`
}

const deleteCookie = (name) => {
    setCookie(name, null, null);
}

const getCookie = (name) => {
    const cookieDecode = decodeURIComponent(document.cookie);
    const cookieArray = cookieDecode.split("; ");
    let result = null;

    cookieArray.forEach(element => {
        if(element.indexOf(name) == 0){
            result = element.substring(name.length + 1)
        }
    })
    return result;
}

export const cookieService = {
    setCookie,
    deleteCookie,
    getCookie,
}

