
//  Imagen Aleatoria

// Para poder generar una imagen aleatoria la cual podremos utilizar en nuestro formulario a la hora de agregar 
// productos en caso de no querer subir unna imagen vamos a relizar lo siguiente:

// 1 - Creamos una constate imgRandom la cual va a tener en su valor una funcion.
// 2 - Creamos nroRandom que tendra como valor mediante Math.round y Math.random un numero entre el 0 y 10.
// 3 - Creamos un objeto llamado arrayImg el cual en cada propiedad tendra un numero como nombre y un url como valor.
// 4 - Luego de ello creamos una constante img la cual va tomar como valor el arrayImg en una posicion random entre 0 y 10.
// 5 - Por ultimo agregamos el retorno de img y exportamos imgRandom.





const imgRandom = () => {
  const nroRandom = Math.round(Math.random() * 10);
  const arrayImg = {
    0: "https://cdn3.iconfinder.com/data/icons/fashion-beauty-vol-1/512/shorts_jeans_pants_clothes-256.png",
    1: "https://cdn0.iconfinder.com/data/icons/baseball-23/48/20-clothing-feet-sock-socks-winter-fashion-clothes-weather-128.png",
    2: "https://cdn4.iconfinder.com/data/icons/men-s-clothing-color/57/shirt_cufflinks_color-128.png",
    3: "https://cdn3.iconfinder.com/data/icons/clothes-94/64/9._t-shirt_clothes_style_look_fashion-128.png",
    4: "https://cdn2.iconfinder.com/data/icons/men-fashion-filled-line/550/hoodie-128.png",
    5: "https://cdn2.iconfinder.com/data/icons/clothes-82/64/loafer-shoe-footwear-clothes-128.png",
    6: "https://cdn3.iconfinder.com/data/icons/interview-element-1/64/suit-business-attire-clothes-man-128.png",
    7: "https://cdn0.iconfinder.com/data/icons/fashion-and-clothes-4/64/clothes_Blazer_cap_hat-128.png",
    8: "https://cdn2.iconfinder.com/data/icons/shoes-6/128/outline_col-03-128.png",
    9: "https://cdn0.iconfinder.com/data/icons/clothes-43/130/_bomber_jacket-128.png",
    10: "https://cdn1.iconfinder.com/data/icons/clothes-and-outfit-vol-1-1/128/jeans_long_fashion_outfit_clothes_shopping_sleeve-128.png",
  };
  const img = arrayImg[nroRandom];
  return img;
};
module.exports = imgRandom;
