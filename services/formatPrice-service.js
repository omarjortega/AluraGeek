const formatPrice = (value) => {
    let format = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    })
    return format.format(value);
}

const priceValueManager = (producto) => {
    //Valores que se pintaran en el card, solo son algunos del total de datos que se pintaran
    let descontado = 0;
    let precio = formatPrice(producto.precio);
    let precioAnterior = 0;
    let descuento = "";

    let productoSinDescuento = "price-centered" //Esto es para aplicar un estilo en cierto caso

    if(producto.descuento > 0 && producto.descuento < 99){
        precioAnterior = formatPrice(producto.precio);
        descontado = (producto.precio * producto.descuento) / 100;
        precio = formatPrice(producto.precio - descontado);
        descuento = producto.descuento + "% OFF";
        productoSinDescuento = "";        
    }else{
        precioAnterior = "";
    }

    return { precio:precio, precioAnterior:precioAnterior, descuento:descuento, estiloProductoSinDescuento:productoSinDescuento}
}

export const priceService = {
    formatPrice,
    priceValueManager,
}