

# splitpad-drivers-poc

Controladores "drivers" para Node.js que permiten que dos teclados numéricos funcionen como un solo teclado:
`npm i usb x11 lodash-joins`

Debes agregar reglas de udev; están en hexadecimal, pero mi código acepta valores decimales en `config.js`.

## ¿Qué es esto?

Esta es una versión económica de un teclado del 40% "planck": dos teclados numéricos inalámbricos; he utilizado el Deltaco TB-125:

![image](https://github.com/user-attachments/assets/26ebb2ed-9e35-4544-8136-b20a58bbbb0e)

![IMG_20240723_090002](https://github.com/user-attachments/assets/8765e323-295f-4469-953c-c0894a8d8a53)


## FAQ

P: ¿Firmware QMK?

R: ¡No! Escribí controladores con libusb que envían eventos de teclas a través de Xlib(x11). Lo escribí rápidamente en 4 horas con node.js; lo reescribiré por completo más adelante. Solo funciona en Linux (ya que no soy usuario de MS Windows).

P: ¿Pero por qué los compraste?

R: Tenía un presupuesto ajustado y soy malo soldando. Actualmente no tengo empleo. Esos teclados numéricos eran bastante baratos y viajo con frecuencia. Tuve malas experiencias con teclados mecánicos, así que pensé que esto no sería tan malo.

P: ¿Cuál es el precio?

R: Me costaron alrededor de 11 EUR/13.50 USD por cada teclado numérico.

P: ¿Por qué el Deltaco TB-125?

R: Bueno, no son teclados numéricos populares. Intenté encontrar el mejor teclado numérico que tuviera teclas del mismo tamaño y la mayor cantidad de teclas posible sin una tecla "+" alta. Este fue el mejor que encontré. Lo pedí en una tienda local. Estaba en oferta. Además, tenga en cuenta no comprar teclados numéricos con tecla "00" o "000", a menos que planees instalarle un firmware (buena suerte), ya que es casi imposible distinguir si mantienes presionada la tecla "0" o las teclas "00"/"000". Envía muchos eventos de presionar y soltar cuando la mantienes presionada, lo que hace un poco difícil escribir buenos controladores para ello. Además, la carcasa es metálica y resistente.

P: ¿Por qué no mecánico?

R: En el pasado tuve malas experiencias con teclados mecánicos y no quiero que sea ruidoso. Me gusta la distancia de activación corta. Esto también es muy cómodo para viajar.

P: ¿Duración de la batería?

R: Un máximo de 2 semanas.

P: ¿Teclas redondas?

R: La verdad es que son cómodas.

P: ¿Hay algún arrepentimiento o inconveniente?

R: Sí. Algunos atajos de teclado pueden no funcionar; por ejemplo, presionar CTRL+ALT+A no me funcionó. Incluso podría no necesitar los botones Super(WIN)/Alt en absoluto; simplemente puedo cambiar los atajos o los controladores.

P: ¿Cuáles son los aspectos positivos?

R: El precio y que no requiere soldadura.

P: ¿Distribución de teclas?

R: Colemak; cambié usando la distribución transicional Tarmak. Me cambié por completo en la Navidad de 2019.

P: ¿Capas?

R: Actualmente uso dos capas. Funcionan bien; también programé símbolos especiales como `!@#$%^&*()_+-=[]{}\|`, F1-F12, teclas de flecha, home, end, pgdn, pgup y algunas otras teclas.

P: ¿Macros?

R: ¡Sí! Actualmente no he añadido macros, pero sí funciona. :)

## Oh no

Esto no está listo para su uso; escribí este código en un par de horas porque estaba emocionado por probarlo lo antes posible.

He notado la cantidad de errores que cometí y no estoy orgulloso del código.
