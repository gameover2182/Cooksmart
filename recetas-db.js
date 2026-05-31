const RECETAS_DB = [
  {
    "id": 1,
    "nombre": "Changua bogotana",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana",
      "sopas"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "leche",
      "huevo",
      "cilantro",
      "pan",
      "sal"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.lechedeflorida.com/file/267/changua.jpg",
    "descripcion": "Sopa tradicional colombiana ideal para empezar el día con energía y calidez.",
    "pasos": [
      "En una olla, mezclar partes iguales de agua y leche.",
      "Llevar a ebullición y agregar sal al gusto.",
      "Romper los huevos con cuidado en la mezcla hirviendo sin romper la yema.",
      "Dejar cocinar por 3-5 minutos hasta que la clara esté firme.",
      "Servir caliente con cilantro fresco picado por encima y pan en el fondo del plato."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 2,
    "nombre": "Arepas con huevo",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "harina maíz",
      "huevo",
      "sal",
      "aceite"
    ],
    "tiempo": 25,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh0rONALPGdLjkP0RFNmJPjI9w5O3uif25yw&s",
    "descripcion": "Deliciosas arepas fritas rellenas de un huevo entero, un clásico de la costa.",
    "pasos": [
      "Preparar la masa con harina de maíz, agua tibia y sal.",
      "Armar arepas delgadas y freírlas en aceite caliente hasta que se inflen.",
      "Sacar la arepa, hacer un pequeño corte y verter un huevo crudo dentro.",
      "Sellar con masa y volver a freír hasta que el huevo se cocine.",
      "Escurrir y servir caliente."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 3,
    "nombre": "Calentado paisa",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana",
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "arroz",
      "frijoles",
      "huevo",
      "chicharrón",
      "cebolla",
      "tomate"
    ],
    "tiempo": 30,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/3C7QWFVIKVE2NP5Q7DKB2AXHWI.jpeg",
    "descripcion": "La mejor manera de aprovechar los restos de comida, lleno de sabor antioqueño.",
    "pasos": [
      "Sofreír cebolla y tomate picados.",
      "Agregar frijoles y arroz del día anterior, mezclar bien.",
      "Freír huevos al gusto en otro sartén.",
      "Servir el calentado con el huevo encima y chicharrón crujiente."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 4,
    "nombre": "Avena con frutas",
    "categoria": "desayuno",
    "etiquetas": [
      "saludable",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "avena",
      "leche",
      "banano",
      "fresa",
      "miel"
    ],
    "tiempo": 10,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://mandolina.co/wp-content/uploads/2020/11/frutas-frescas-1200x720.jpg",
    "descripcion": "Desayuno nutritivo, rápido y lleno de energía para comenzar tus mañanas.",
    "pasos": [
      "Calentar leche en una olla a fuego medio.",
      "Agregar avena y revolver hasta que espese (5 min).",
      "Servir en un tazón.",
      "Picar frutas y decorar con miel."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 5,
    "nombre": "Tostadas francesas",
    "categoria": "desayuno",
    "etiquetas": [
      "postres",
      "vegetariano"
    ],
    "restricciones": [],
    "ingredientes": [
      "pan",
      "huevo",
      "leche",
      "canela",
      "mantequilla"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://okdiario.com/img/2019/04/14/tostadas-francesas-2.jpg",
    "descripcion": "Tostadas dulces y esponjosas con un toque de canela, perfectas para un domingo.",
    "pasos": [
      "Batir huevo con leche y canela.",
      "Sumergir rebanadas de pan en la mezcla.",
      "Calentar mantequilla en un sartén.",
      "Dorar el pan 3 minutos por cada lado."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 6,
    "nombre": "Tamal tolimense",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana",
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "masa maíz",
      "pollo",
      "cerdo",
      "arveja",
      "zanahoria",
      "huevo"
    ],
    "tiempo": 120,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&q=80",
    "descripcion": "Un manjar tradicional envuelto en hojas de plátano, requiere tiempo pero vale la pena.",
    "pasos": [
      "Preparar la masa sazonada con caldo.",
      "Guisar las carnes.",
      "Limpiar hojas de plátano y armar con masa, carnes y verduras.",
      "Envolver y amarrar con pita.",
      "Cocinar al vapor por 2 horas."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 7,
    "nombre": "Huevos pericos",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana",
      "rapida",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "huevo",
      "tomate",
      "cebolla",
      "cilantro",
      "sal"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
    "descripcion": "El desayuno más rápido y común en Colombia, lleno de color y sabor.",
    "pasos": [
      "Picar cebolla y tomate finamente.",
      "Sofreír en aceite hasta hacer un guiso.",
      "Verter huevos batidos sobre el guiso.",
      "Revolver hasta cuajar y servir con cilantro."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 8,
    "nombre": "Pandebono",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana",
      "postres"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "queso",
      "harina yuca",
      "harina maíz",
      "huevo",
      "leche"
    ],
    "tiempo": 30,
    "dificultad": "Media",
    "porciones": 6,
    "match": 0,
    "imagen": "https://hazdeoros.com/familiar/wp-content/uploads/2024/09/almojabanas-baked-on-a-baking-sheet-2023-11-27-04-49-27-utc.jpg",
    "descripcion": "Panecillos de queso colombianos, crujientes por fuera y suaves por dentro.",
    "pasos": [
      "Rallar queso y mezclar con harinas.",
      "Añadir huevo y leche poco a poco amansando.",
      "Formar bolitas de masa.",
      "Hornear a 200°C por 15-20 minutos."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 9,
    "nombre": "Bandeja paisa",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana",
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "frijoles",
      "arroz",
      "carne",
      "huevo",
      "chicharrón",
      "chorizo",
      "aguacate"
    ],
    "tiempo": 90,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://cdn.colombia.com/gastronomia/2011/08/02/bandeja-paisa-1616.gif",
    "descripcion": "El plato insignia de Antioquia, abundante y lleno de diferentes texturas y sabores.",
    "pasos": [
      "Cocinar frijoles con plátano y guiso.",
      "Preparar arroz blanco.",
      "Freír chicharrón, chorizo y carne.",
      "Freír un huevo y servir todo con aguacate."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 10,
    "nombre": "Ajiaco bogotano",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana",
      "sopas"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pollo",
      "papa criolla",
      "papa pastusa",
      "guascas",
      "mazorca",
      "crema de leche"
    ],
    "tiempo": 90,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/3964b77d9ff84585e562ad1bd1205e25.jpg",
    "descripcion": "Sopa espesa de papas con pollo desmechado y el toque inconfundible de las guascas.",
    "pasos": [
      "Cocinar pollo con cebolla y ajo, retirar y desmechar.",
      "Cocinar papas y mazorca en el caldo hasta que la papa criolla deshaga.",
      "Añadir pollo y guascas al final.",
      "Servir con crema de leche y alcaparras."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 11,
    "nombre": "Sancocho de pollo",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana",
      "sopas"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pollo",
      "yuca",
      "papa",
      "plátano",
      "mazorca",
      "cilantro"
    ],
    "tiempo": 90,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
    "descripcion": "Sopa tradicional de los domingos familiares en Colombia, reconfortante y deliciosa.",
    "pasos": [
      "Hervir agua con aliños y pollo.",
      "Agregar plátano y mazorca.",
      "Incorporar papa y yuca cuando el pollo esté tierno.",
      "Añadir cilantro fresco antes de servir."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 12,
    "nombre": "Arroz con pollo al curry",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica",
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pollo",
      "arroz",
      "curry",
      "cebolla",
      "ajo"
    ],
    "tiempo": 35,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
    "descripcion": "Una versión especiada y rápida del clásico arroz con pollo.",
    "pasos": [
      "Dorar cubos de pollo con cebolla.",
      "Añadir curry y arroz, mezclar bien.",
      "Verter agua (doble que de arroz) y sal.",
      "Cocinar a fuego bajo 20 minutos."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 13,
    "nombre": "Pasta fresca con tomate",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "pasta",
      "tomate",
      "ajo",
      "albahaca",
      "aceite"
    ],
    "tiempo": 25,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjH_kgPG7L5sNl8-uEY6L3ttNTSOTkwkRrxw&s",
    "descripcion": "Plato italiano simple pero perfecto, ideal cuando tienes pocos ingredientes.",
    "pasos": [
      "Cocinar pasta al dente.",
      "Sofreír ajos y tomates picados en aceite.",
      "Mezclar pasta con la salsa de tomate.",
      "Decorar con albahaca fresca."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 14,
    "nombre": "Cazuela de mariscos",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana",
      "mariscos",
      "sopas"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "camarón",
      "calamar",
      "leche coco",
      "papa",
      "cebolla",
      "ajo"
    ],
    "tiempo": 45,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&q=80",
    "descripcion": "Sopa cremosa del Pacífico colombiano, llena de sabor a mar y coco.",
    "pasos": [
      "Hacer guiso de cebolla y ajo.",
      "Cocinar calamares y papas en caldo.",
      "Agregar leche de coco y camarones al final.",
      "Cocinar 5 min más y servir."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 15,
    "nombre": "Sopa de lentejas",
    "categoria": "almuerzo",
    "etiquetas": [
      "sopas",
      "saludable",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "lentejas",
      "zanahoria",
      "cebolla",
      "ajo",
      "tomate",
      "papa"
    ],
    "tiempo": 40,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=80",
    "descripcion": "Nutritiva sopa de lentejas casera, rica en hierro y fibra.",
    "pasos": [
      "Cocinar lentejas hasta que ablanden.",
      "Hacer guiso con verduras.",
      "Mezclar guiso y papas con las lentejas.",
      "Cocinar hasta que espese."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 16,
    "nombre": "Pollo a la plancha con ensalada",
    "categoria": "almuerzo",
    "etiquetas": [
      "saludable",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pollo",
      "lechuga",
      "tomate",
      "zanahoria",
      "limón",
      "aceite"
    ],
    "tiempo": 25,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    "descripcion": "Almuerzo ligero, saludable y muy rápido de preparar para cualquier día de la semana.",
    "pasos": [
      "Sazonar pollo y dorar en plancha.",
      "Preparar ensalada picando vegetales.",
      "Aderezar con limón y aceite.",
      "Servir juntos."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 17,
    "nombre": "Frijoles con garra",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana",
      "sopas"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "frijoles",
      "pata cerdo",
      "cebolla",
      "tomate",
      "zanahoria"
    ],
    "tiempo": 120,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&q=80",
    "descripcion": "Un plato sustancioso donde la pata de cerdo le da una textura inigualable a los frijoles.",
    "pasos": [
      "Remojar frijoles.",
      "Pitar frijoles con la pata de cerdo.",
      "Hacer guiso con aliños.",
      "Incorporar guiso y conservar hasta espesar."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 18,
    "nombre": "Arroz con atún",
    "categoria": "almuerzo",
    "etiquetas": [
      "mariscos",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "arroz",
      "atún",
      "zanahoria",
      "arveja",
      "cebolla"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",
    "descripcion": "El salvavidas perfecto: rápido, económico y muy nutritivo.",
    "pasos": [
      "Cocinar arroz blanco.",
      "Sofreír verduras y atún.",
      "Mezclar con el arroz cocido.",
      "Servir caliente."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 19,
    "nombre": "Crema de ahuyama",
    "categoria": "cena",
    "etiquetas": [
      "sopas",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ahuyama",
      "leche",
      "cebolla",
      "ajo",
      "crema de leche"
    ],
    "tiempo": 30,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=80",
    "descripcion": "Suave y reconfortante crema ideal para una cena ligera.",
    "pasos": [
      "Cocinar ahuyama en agua hasta ablandar.",
      "Licuar con leche y sofrito de cebolla.",
      "Volver a fuego y añadir crema.",
      "Sazonar y servir."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 20,
    "nombre": "Quesadillas de pollo",
    "categoria": "cena",
    "etiquetas": [
      "mexicana",
      "rapida"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "tortilla",
      "pollo",
      "queso",
      "pimentón",
      "cebolla"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
    "descripcion": "Tortillas tostadas rellenas de queso derretido y tiras de pollo jugoso.",
    "pasos": [
      "Saltear pollo con verduras.",
      "Poner tortilla en sartén con queso.",
      "Añadir pollo y doblar tortilla.",
      "Dorar por ambos lados."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 21,
    "nombre": "Pasta carbonara",
    "categoria": "cena",
    "etiquetas": [
      "italiana",
      "parrilla"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "pasta",
      "huevo",
      "queso",
      "tocino",
      "pimienta"
    ],
    "tiempo": 25,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
    "descripcion": "La auténtica receta romana, sin crema, solo huevos, queso y tocino.",
    "pasos": [
      "Cocinar pasta.",
      "Dorar tocino.",
      "Mezclar huevo con queso.",
      "Combinar todo con la pasta caliente fuera del fuego."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 22,
    "nombre": "Pollo salteado con vegetales",
    "categoria": "cena",
    "etiquetas": [
      "asiatica",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pollo",
      "zanahoria",
      "brócoli",
      "ajo",
      "soya"
    ],
    "tiempo": 40,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
    "descripcion": "Una cena al estilo asiático llena de verduras crujientes y pollo tierno.",
    "pasos": [
      "Marinar pollo con soya.",
      "Cortar vegetales.",
      "Saltear pollo a fuego alto.",
      "Añadir vegetales y saltear rápido."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 23,
    "nombre": "Bowl de arroz asiático",
    "categoria": "cena",
    "etiquetas": [
      "asiatica",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "arroz",
      "soya",
      "zanahoria",
      "huevo",
      "cebolla",
      "aceite sésamo"
    ],
    "tiempo": 30,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
    "descripcion": "Un tazón reconfortante con base de arroz y toppings versátiles.",
    "pasos": [
      "Poner arroz cocido en bowl.",
      "Freír un huevo.",
      "Saltear cebolla y zanahoria.",
      "Armar bowl con todo y soya."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 24,
    "nombre": "Sopa minestrone",
    "categoria": "cena",
    "etiquetas": [
      "italiana",
      "sopas",
      "vegetariano"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "pasta",
      "zanahoria",
      "tomate",
      "apio",
      "frijoles",
      "cebolla"
    ],
    "tiempo": 45,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    "descripcion": "Sopa italiana cargada de vegetales, frijoles y pasta corta.",
    "pasos": [
      "Hacer sofrito de vegetales.",
      "Agregar tomate y caldo.",
      "Cocinar frijoles y pasta en la sopa.",
      "Servir con queso."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 25,
    "nombre": "Tortilla española",
    "categoria": "cena",
    "etiquetas": [
      "vegetariano",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "papa",
      "huevo",
      "cebolla",
      "aceite",
      "sal"
    ],
    "tiempo": 35,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",
    "descripcion": "La clásica receta ibérica gruesa y jugosa, perfecta para cualquier ocasión.",
    "pasos": [
      "Freír papas y cebolla en láminas.",
      "Mezclar con huevo batido.",
      "Cuajar en sartén por ambos lados.",
      "Dejar jugosa por dentro."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 26,
    "nombre": "Wrap de pollo",
    "categoria": "cena",
    "etiquetas": [
      "saludable",
      "rapida"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "tortilla",
      "pollo",
      "lechuga",
      "tomate",
      "aguacate"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
    "descripcion": "Cena ligera enrollada, fresca y sin complicaciones.",
    "pasos": [
      "Calentar tortilla.",
      "Poner lechuga, pollo y aguacate.",
      "Enrollar apretado.",
      "Cortar y servir."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 27,
    "nombre": "Curry de garbanzos",
    "categoria": "vegetariano",
    "etiquetas": [
      "asiatica",
      "vegana",
      "sopas"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "garbanzo",
      "tomate",
      "leche coco",
      "curry",
      "cebolla",
      "ajo"
    ],
    "tiempo": 35,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
    "descripcion": "Plato vegano hindú, cremoso, aromático y muy sustancioso.",
    "pasos": [
      "Sofreír especias con cebolla.",
      "Añadir tomate y garbanzos.",
      "Bañar con leche de coco.",
      "Cocinar 15 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 28,
    "nombre": "Burger de lentejas",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegetariano",
      "parrilla"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "lentejas",
      "avena",
      "cebolla",
      "ajo",
      "zanahoria"
    ],
    "tiempo": 40,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
    "descripcion": "Hamburguesas sin carne, altas en proteína vegetal y que no se desarman.",
    "pasos": [
      "Triturar lentejas.",
      "Mezclar con verduras sofritas y avena.",
      "Formar hamburguesas.",
      "Dorar en plancha."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 29,
    "nombre": "Ensalada César vegana",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "lechuga",
      "garbanzo",
      "limón",
      "ajo",
      "aceite"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80",
    "descripcion": "Versión plant-based de la famosa ensalada, usando garbanzos crujientes en lugar de pollo.",
    "pasos": [
      "Tostar garbanzos.",
      "Trocear lechuga.",
      "Licuar aderezo de limón y ajo.",
      "Mezclar todo."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 30,
    "nombre": "Arroz frito con verduras",
    "categoria": "vegetariano",
    "etiquetas": [
      "asiatica",
      "vegana",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "arroz",
      "zanahoria",
      "arveja",
      "cebolla",
      "huevo",
      "soya"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&q=80",
    "descripcion": "El arroz chino casero en versión vegetariana, rápido de hacer con arroz del día anterior.",
    "pasos": [
      "Hacer huevo revuelto.",
      "Saltear verduras.",
      "Mezclar con arroz y soya.",
      "Saltear todo junto."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 31,
    "nombre": "Tacos de frijoles",
    "categoria": "vegetariano",
    "etiquetas": [
      "mexicana",
      "rapida",
      "vegana"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "tortilla",
      "frijoles",
      "queso",
      "tomate",
      "aguacate"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    "descripcion": "Tacos vegetarianos express, llenadores y muy sabrosos.",
    "pasos": [
      "Hacer puré de frijoles.",
      "Calentar tortillas.",
      "Poner frijoles, queso y aguacate.",
      "Servir con salsa."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 32,
    "nombre": "Pasta con pesto",
    "categoria": "vegetariano",
    "etiquetas": [
      "italiana",
      "vegetariano",
      "rapida"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "pasta",
      "albahaca",
      "ajo",
      "queso",
      "aceite"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
    "descripcion": "Pasta cubierta con una salsa verde brillante de hierbas y aceite crudo.",
    "pasos": [
      "Cocinar pasta.",
      "Triturar albahaca, ajo y queso.",
      "Añadir aceite al pesto.",
      "Mezclar con la pasta."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 33,
    "nombre": "Crema de brócoli",
    "categoria": "vegetariano",
    "etiquetas": [
      "sopas",
      "saludable",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "brócoli",
      "leche",
      "ajo",
      "cebolla",
      "queso"
    ],
    "tiempo": 25,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.unileverfoodsolutionslatam.com/dam/global-ufs/mcos/nola/cam/calcmenu/recipes/CR-recipes/soups/crema-de-br%C3%B3coli-con-cheddar/main-header.jpg",
    "descripcion": "Sopa verde muy sedosa y saludable, enriquecida con queso.",
    "pasos": [
      "Hervir brócoli con cebolla.",
      "Licuar con leche.",
      "Calentar con queso rallado.",
      "Servir suave."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 34,
    "nombre": "Revuelto de tofu",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "saludable",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "tofu",
      "pimentón",
      "cebolla",
      "ajo",
      "cúrcuma"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://i.blogs.es/a7af5d/revuelto-tofu/1366_2000.jpg",
    "descripcion": "La alternativa vegana perfecta a los huevos revueltos, cargada de especias.",
    "pasos": [
      "Desmenuzar tofu.",
      "Sofreír verduras.",
      "Añadir tofu y cúrcuma.",
      "Cocinar 7 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 35,
    "nombre": "Arroz frito con huevo",
    "categoria": "rapido",
    "etiquetas": [
      "asiatica",
      "vegetariano",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "arroz",
      "huevo",
      "soya",
      "cebolla",
      "ajo"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
    "descripcion": "El platillo asiático de rescate para cuando hay hambre y sobras de arroz.",
    "pasos": [
      "Hacer huevo revuelto.",
      "Saltear ajo.",
      "Añadir arroz y soya.",
      "Mezclar todo."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 36,
    "nombre": "Ensalada de atún",
    "categoria": "rapido",
    "etiquetas": [
      "mariscos",
      "saludable",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "atún",
      "lechuga",
      "tomate",
      "cebolla",
      "limón"
    ],
    "tiempo": 10,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    "descripcion": "Refrescante, proteica y que se prepara en menos de lo que tarda en hervir agua.",
    "pasos": [
      "Escurrir atún.",
      "Picar verduras.",
      "Mezclar con limón.",
      "Servir frío."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 37,
    "nombre": "Sándwich de pollo",
    "categoria": "rapido",
    "etiquetas": [
      "rapida",
      "parrilla"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pan",
      "pollo",
      "lechuga",
      "tomate",
      "mayonesa"
    ],
    "tiempo": 10,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&q=80",
    "descripcion": "Clásico emparedado frío, ideal para la lonchera o una cena express.",
    "pasos": [
      "Mezclar pollo con mayonesa.",
      "Tostar pan.",
      "Armar con lechuga y tomate.",
      "Cerrar y servir."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 38,
    "nombre": "Huevos rancheros",
    "categoria": "rapido",
    "etiquetas": [
      "mexicana",
      "vegetariano",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "huevo",
      "tomate",
      "cebolla",
      "chile",
      "cilantro",
      "tortilla"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
    "descripcion": "Huevos fritos bañados en una salsa picante sobre tortillas de maíz.",
    "pasos": [
      "Hacer salsa ranchera.",
      "Dorar tortilla.",
      "Freír huevos.",
      "Bañar con salsa caliente."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 39,
    "nombre": "Pasta con mantequilla y ajo",
    "categoria": "rapido",
    "etiquetas": [
      "italiana",
      "vegetariano",
      "rapida"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "pasta",
      "mantequilla",
      "ajo",
      "perejil",
      "queso"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
    "descripcion": "Pasta simple y elegante que exprime al máximo el sabor del ajo.",
    "pasos": [
      "Cocinar pasta.",
      "Derretir mantequilla con ajo.",
      "Mezclar pasta con mantequilla.",
      "Añadir perejil y queso."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 40,
    "nombre": "Bowl de yogurt con frutas",
    "categoria": "rapido",
    "etiquetas": [
      "postres",
      "saludable",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "yogurt",
      "banano",
      "fresa",
      "granola",
      "miel"
    ],
    "tiempo": 5,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
    "descripcion": "Desayuno o snack instantáneo sin cocción y sumamente saludable.",
    "pasos": [
      "Poner yogurt en bowl.",
      "Picar frutas.",
      "Añadir granola.",
      "Endulzar con miel."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 41,
    "nombre": "Lomo Saltado",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla",
      "rapida"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-gluten"
    ],
    "ingredientes": [
      "res",
      "papa",
      "cebolla",
      "tomate",
      "soya"
    ],
    "tiempo": 25,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://i.blogs.es/b0a5c0/lomo_saltado/1200_900.jpg",
    "descripcion": "Famoso salteado peruano de res con cebolla, tomate y papas fritas.",
    "pasos": [
      "Freír papas en bastones.",
      "Saltear carne a fuego alto.",
      "Añadir cebolla y tomate en gajos.",
      "Mezclar con soya y vinagre.",
      "Servir con las papas fritas."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 42,
    "nombre": "Pizza Margarita",
    "categoria": "cena",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [],
    "ingredientes": [
      "masa pizza",
      "tomate",
      "queso",
      "albahaca"
    ],
    "tiempo": 30,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
    "descripcion": "La pizza más clásica con tomate, mozzarella fresca y albahaca.",
    "pasos": [
      "Extender la masa.",
      "Poner salsa de tomate y queso.",
      "Hornear a 250°C por 10 min.",
      "Añadir albahaca fresca al salir."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 43,
    "nombre": "Sushi Roll California",
    "categoria": "cena",
    "etiquetas": [
      "asiatica",
      "mariscos"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-gluten"
    ],
    "ingredientes": [
      "arroz sushi",
      "alga nori",
      "surimi",
      "pepino",
      "aguacate"
    ],
    "tiempo": 45,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEzmOy71SL1b1rs6at2Dz0G9HHqzShB97MdA&s",
    "descripcion": "Rollo de sushi con surimi, pepino y aguacate, envuelto en alga y arroz.",
    "pasos": [
      "Extender arroz sobre el alga.",
      "Poner relleno en el centro.",
      "Enrollar con ayuda de la esterilla.",
      "Cortar en 8 piezas iguales."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 44,
    "nombre": "Burritos Norteños",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana",
      "parrilla"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "tortilla harina",
      "carne",
      "frijoles",
      "queso",
      "salsa"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
    "descripcion": "Grandes tortillas de harina rellenas de carne, frijoles y mucho sabor.",
    "pasos": [
      "Calentar tortillas.",
      "Poner frijoles y carne.",
      "Añadir queso y salsa.",
      "Doblar los bordes y enrollar."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 45,
    "nombre": "Pad Thai",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica",
      "rapida"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-gluten"
    ],
    "ingredientes": [
      "fideos arroz",
      "camarón",
      "maní",
      "huevo",
      "tamarindo"
    ],
    "tiempo": 25,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=80",
    "descripcion": "Fideos de arroz salteados con camarones, maní y brotes de soja.",
    "pasos": [
      "Hidratar fideos.",
      "Saltear camarones y huevo.",
      "Añadir fideos y salsa de tamarindo.",
      "Servir con maní triturado."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 46,
    "nombre": "Ensalada Griega",
    "categoria": "vegetariano",
    "etiquetas": [
      "saludable",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "pepino",
      "tomate",
      "olivas",
      "queso feta",
      "aceite oliva"
    ],
    "tiempo": 10,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
    "descripcion": "Ensalada fresca con pepino, tomate, olivas y queso feta.",
    "pasos": [
      "Trocear pepino y tomate.",
      "Añadir olivas negras.",
      "Poner cubos de queso feta.",
      "Aderezar con orégano y aceite."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 47,
    "nombre": "Brownies Saludables",
    "categoria": "rapido",
    "etiquetas": [
      "postres",
      "saludable"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "banano",
      "cacao",
      "huevo",
      "nueces",
      "miel"
    ],
    "tiempo": 25,
    "dificultad": "Fácil",
    "porciones": 8,
    "match": 0,
    "imagen": "https://sugarspunrun.com/wp-content/uploads/2019/08/Homemade-Brownies-Recipe-1-of-1.jpg",
    "descripcion": "Brownies melcochudos hechos con camote o banano, sin azúcares refinados.",
    "pasos": [
      "Machacar banano.",
      "Mezclar con cacao y huevo.",
      "Añadir nueces.",
      "Hornear a 180°C por 20 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 48,
    "nombre": "Sopa de Cebolla",
    "categoria": "cena",
    "etiquetas": [
      "sopas",
      "saludable"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "cebolla",
      "caldo",
      "pan",
      "queso",
      "vino blanco"
    ],
    "tiempo": 40,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://i.blogs.es/8042a0/sopa_cebolla/1200_900.jpg",
    "descripcion": "Sopa francesa caramelizada con costra de pan y queso fundido.",
    "pasos": [
      "Caramelizar cebollas lentamente.",
      "Añadir vino y caldo.",
      "Cocinar 20 min.",
      "Gratinar con pan y queso encima."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 49,
    "nombre": "Salmón al Horno",
    "categoria": "almuerzo",
    "etiquetas": [
      "mariscos",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "salmón",
      "limón",
      "romero",
      "ajo",
      "aceite oliva"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Filete de salmón asado con hierbas y rodajas de limón.",
    "pasos": [
      "Poner salmón en bandeja.",
      "Sazonar con ajo y romero.",
      "Poner rodajas de limón.",
      "Hornear a 200°C por 12 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 50,
    "nombre": "Hummus con Pita",
    "categoria": "rapido",
    "etiquetas": [
      "vegana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "garbanzo",
      "tahini",
      "ajo",
      "limón",
      "aceite oliva"
    ],
    "tiempo": 10,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlYWExzpxEKsCGaEDdRNJ2I2P10MgQIVrxiA&s",
    "descripcion": "Crema de garbanzos suave con tahini, servida con pan pita caliente.",
    "pasos": [
      "Licuar garbanzos con tahini.",
      "Añadir limón y ajo.",
      "Verter aceite en hilo.",
      "Servir con pimentón."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 51,
    "nombre": "Paella de Marisco",
    "categoria": "almuerzo",
    "etiquetas": [
      "mariscos",
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "arroz",
      "camarón",
      "mejillón",
      "azafrán",
      "pimentón"
    ],
    "tiempo": 60,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLF5oWHPTpwF7I7SiS0Fa5eDDXRKBprhvZjg&s",
    "descripcion": "Arroz español con azafrán, mejillones, calamares y camarones.",
    "pasos": [
      "Sofreír mariscos.",
      "Añadir arroz y azafrán.",
      "Verter caldo caliente.",
      "Cocinar sin revolver 20 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 52,
    "nombre": "Falafel Crujiente",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "rapida"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "garbanzo",
      "perejil",
      "ajo",
      "comino",
      "cebolla"
    ],
    "tiempo": 30,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTQH53-u48H9cZNB_TKq0WScX8f6ThWfoP3g&s",
    "descripcion": "Croquetas de garbanzo fritas, especiadas con comino y perejil.",
    "pasos": [
      "Triturar garbanzos hidratados.",
      "Mezclar con especias y hierbas.",
      "Formar bolitas.",
      "Freír hasta dorar."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 53,
    "nombre": "Tacos al Pastor",
    "categoria": "cena",
    "etiquetas": [
      "mexicana",
      "parrilla"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "cerdo",
      "piña",
      "tortilla maíz",
      "achiote",
      "cebolla"
    ],
    "tiempo": 40,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80",
    "descripcion": "Tacos de cerdo marinado con piña, cebolla y cilantro.",
    "pasos": [
      "Marinar carne con achiote.",
      "Asar con trozos de piña.",
      "Picar la carne.",
      "Servir en tortillas con piña."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 54,
    "nombre": "Raviolis de Espinaca",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "raviolis",
      "espinaca",
      "queso ricotta",
      "mantequilla",
      "salvia"
    ],
    "tiempo": 25,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80",
    "descripcion": "Pasta rellena de espinaca y ricotta con salsa de mantequilla y salvia.",
    "pasos": [
      "Hervir pasta rellena.",
      "Derretir mantequilla con salvia.",
      "Escurrir pasta.",
      "Saltear en la mantequilla."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 55,
    "nombre": "Ratatouille Tradicional",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "berenjena",
      "calabacín",
      "tomate",
      "pimentón",
      "hierbas"
    ],
    "tiempo": 50,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw2wc8uzFEoKuDmWxjpfAPxh8CW46ZTLmKKA&s",
    "descripcion": "Guiso francés de vegetales horneados: berenjena, calabacín y pimentón.",
    "pasos": [
      "Rebanar vegetales.",
      "Disponer en espiral.",
      "Sazonar con hierbas.",
      "Hornear tapado 40 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 56,
    "nombre": "Gazpacho Andaluz",
    "categoria": "rapido",
    "etiquetas": [
      "sopas",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "tomate",
      "pepino",
      "pimentón",
      "ajo",
      "aceite oliva"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxiEnnDwnKIDgJ9Lgufbu1_hp0ehWRXTuiAA&s",
    "descripcion": "Sopa fría de tomate y pepino, perfecta para días calurosos.",
    "pasos": [
      "Licuar todos los vegetales.",
      "Pasar por un colador fino.",
      "Enfriar en nevera.",
      "Servir con chorrito de aceite."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 57,
    "nombre": "Ceviche Peruano",
    "categoria": "almuerzo",
    "etiquetas": [
      "mariscos",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pescado blanco",
      "limón",
      "ají",
      "cebolla roja",
      "cilantro"
    ],
    "tiempo": 20,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTev_Mpr76_C4LzUGFHTOKaTaD11u6CL5QoBw&s",
    "descripcion": "Pescado blanco marinado en limón con ají, cebolla roja y camote.",
    "pasos": [
      "Cortar pescado en cubos.",
      "Marinar con limón y sal.",
      "Añadir ají y cebolla roja.",
      "Servir con camote cocido."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 58,
    "nombre": "Risotto de Hongos",
    "categoria": "cena",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "arroz arborio",
      "hongos",
      "cebolla",
      "caldo",
      "queso"
    ],
    "tiempo": 40,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
    "descripcion": "Arroz arborio cremoso cocinado lentamente con champiñones y parmesano.",
    "pasos": [
      "Sofreír arroz y hongos.",
      "Añadir caldo poco a poco.",
      "Revolver constantemente.",
      "Terminar con mantequilla y queso."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 59,
    "nombre": "Chili con Carne",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana",
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "carne molida",
      "frijoles",
      "tomate",
      "ají",
      "comino"
    ],
    "tiempo": 45,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://static01.nyt.com/images/2025/10/28/multimedia/28FD-classic-chili-con-carne-jvlq/28FD-classic-chili-con-carne-jvlq-videoSixteenByNineJumbo1600.jpg",
    "descripcion": "Guiso picante de carne molida con frijoles, tomate y chiles.",
    "pasos": [
      "Dorar carne molida.",
      "Añadir frijoles y tomate.",
      "Sazonar con comino y ají.",
      "Cocinar a fuego lento 30 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 60,
    "nombre": "Ensalada Caprese",
    "categoria": "rapido",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "mozzarella",
      "tomate",
      "albahaca",
      "aceite oliva",
      "vinagre"
    ],
    "tiempo": 5,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    "descripcion": "Sencilla combinación de mozzarella, tomate y albahaca con aceite de oliva.",
    "pasos": [
      "Rebanar tomate y mozzarella.",
      "Alternar en el plato.",
      "Poner hojas de albahaca.",
      "Bañar con aceite y vinagre."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 61,
    "nombre": "Berenjenas a la Parmesana",
    "categoria": "vegetariano",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "berenjena",
      "tomate",
      "queso",
      "huevo",
      "harina"
    ],
    "tiempo": 50,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNTxZIZdcWXXvoYpm8wQGnaanMdkVuh_hj_g&s",
    "descripcion": "Capas de berenjena frita con salsa de tomate y mucho queso gratinado.",
    "pasos": [
      "Freír láminas de berenjena.",
      "Armar capas con salsa y queso.",
      "Repetir 3 veces.",
      "Hornear 25 min hasta gratinar."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 62,
    "nombre": "Sopa de Miso Japonesa",
    "categoria": "rapido",
    "etiquetas": [
      "asiatica",
      "sopas"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "pasta miso",
      "tofu",
      "algas",
      "cebollín",
      "caldo dashi"
    ],
    "tiempo": 10,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
    "descripcion": "Caldo ligero japonés con pasta de miso, tofu y algas.",
    "pasos": [
      "Calentar caldo sin hervir.",
      "Disolver pasta miso.",
      "Añadir tofu y algas.",
      "Servir con cebollín."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 63,
    "nombre": "Lasaña de Vegetales",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "pasta lasaña",
      "espinaca",
      "hongos",
      "queso",
      "leche"
    ],
    "tiempo": 60,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&q=80",
    "descripcion": "Lasaña cargada de espinacas, champiñones y berenjenas en salsa bechamel.",
    "pasos": [
      "Hacer bechamel.",
      "Saltear vegetales.",
      "Armar capas de pasta y relleno.",
      "Gratinar al horno 30 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 64,
    "nombre": "Pescado Frito Crujiente",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana",
      "mariscos"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "pescado entero",
      "limón",
      "aceite",
      "sal",
      "harina"
    ],
    "tiempo": 25,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Pescado entero frito, típico de las playas, servido con patacón.",
    "pasos": [
      "Limpiar y salar pescado.",
      "Pasar por harina.",
      "Freír en abundante aceite.",
      "Servir con limón."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 65,
    "nombre": "Bowl de Quinoa y Camote",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "quinoa",
      "camote",
      "espinaca",
      "garbanzo",
      "tahini"
    ],
    "tiempo": 35,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnZfv37083i8GpliBfUpKjyPuzOVKLrEI_xA&s",
    "descripcion": "Tazón nutritivo con quinoa, camote asado y aderezo de tahini.",
    "pasos": [
      "Cocinar quinoa.",
      "Asar cubos de camote.",
      "Poner espinaca en base.",
      "Mezclar todo con tahini."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 66,
    "nombre": "Fajitas de Res Tex-Mex",
    "categoria": "cena",
    "etiquetas": [
      "mexicana",
      "parrilla"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "res",
      "pimentón",
      "cebolla",
      "tortillas",
      "comino"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://i.blogs.es/0aa474/fajitas-sanas-2/1366_2000.jpg",
    "descripcion": "Tiras de res salteadas con pimientos y cebollas, servidas en tortillas.",
    "pasos": [
      "Saltear carne tiras.",
      "Añadir pimientos juliana.",
      "Calentar tortillas.",
      "Armar con guacamole."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 67,
    "nombre": "Pollo Teriyaki con Brócoli",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica",
      "rapida"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "pollo",
      "brócoli",
      "soya",
      "miel",
      "jengibre"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlt4VB1Pv0oBZHnbNazWB5AAx53kBHyoTKLw&s",
    "descripcion": "Pollo glaseado en salsa teriyaki dulce con brócoli al vapor.",
    "pasos": [
      "Dorar pollo troceado.",
      "Bañar con salsa soya/miel.",
      "Cocinar brócoli al vapor.",
      "Servir con sésamo."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 68,
    "nombre": "Sopa de Tortilla Mexicana",
    "categoria": "cena",
    "etiquetas": [
      "mexicana",
      "sopas"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "tomate",
      "tortilla",
      "aguacate",
      "queso",
      "caldo pollo"
    ],
    "tiempo": 30,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://mandolina.co/wp-content/uploads/2020/11/sopa-de-tortilla-destacada-1200x720.jpg",
    "descripcion": "Caldo de tomate picante con tiras de tortilla frita y aguacate.",
    "pasos": [
      "Licuar tomates asados.",
      "Hervir caldo con salsa.",
      "Freír tiras de tortilla.",
      "Servir con aguacate y queso."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 69,
    "nombre": "Penne al Pesto Cremoso",
    "categoria": "rapido",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "pasta penne",
      "albahaca",
      "nueces",
      "crema leche",
      "queso"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80",
    "descripcion": "Pasta penne con salsa de albahaca, nueces y un toque de crema.",
    "pasos": [
      "Hervir pasta.",
      "Licuar pesto con crema.",
      "Mezclar caliente.",
      "Servir con parmesano."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 70,
    "nombre": "Crepas de Fresa y Chocolate",
    "categoria": "rapido",
    "etiquetas": [
      "postres",
      "italiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "harina",
      "leche",
      "huevo",
      "fresa",
      "chocolate"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrpYYcX2aUoPzuWc_JF7tZ_PaW6dFYnn1jZg&s",
    "descripcion": "Delgadas crepas francesas rellenas de fresas frescas y ganache.",
    "pasos": [
      "Hacer masa líquida.",
      "Cocinar discos finos.",
      "Rellenar con fruta.",
      "Bañar con chocolate."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 71,
    "nombre": "Caldo de Pollo Casero",
    "categoria": "cena",
    "etiquetas": [
      "colombiana",
      "sopas"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pollo",
      "papa",
      "zanahoria",
      "apio",
      "fideos"
    ],
    "tiempo": 40,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
    "descripcion": "Sopa reconfortante con presas de pollo, verduras y fideos.",
    "pasos": [
      "Hervir pollo con verduras.",
      "Añadir fideos.",
      "Sazonar al gusto.",
      "Servir caliente."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 72,
    "nombre": "Brochetas de Pollo al Limón",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "pollo",
      "limón",
      "ajo",
      "pimentón",
      "cebolla"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.coren.es/wp-content/uploads/2018/07/Brochetas-de-pollo-y-verduras.jpeg",
    "descripcion": "Pinchos de pollo marinados en limón y ajo, asados a la parrilla.",
    "pasos": [
      "Armar brochetas pollo/vegetal.",
      "Marinar con limón.",
      "Asar a la parrilla.",
      "Girar hasta dorar."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 73,
    "nombre": "Pastel de Chocolate Esponjoso",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "harina",
      "cacao",
      "azúcar",
      "huevo",
      "mantequilla"
    ],
    "tiempo": 30,
    "dificultad": "Media",
    "porciones": 8,
    "match": 0,
    "imagen": "https://peopleenespanol.com/thmb/8_0BHEJkXcIbYVOu9r2Z1ntoonc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/3a23ae4b-48b7-44eb-96a7-0e8e755683b6-2000-c618f18c242d47ca89eaddea62579593.jpg",
    "descripcion": "Bizcocho de chocolate oscuro, suave y perfecto para compartir.",
    "pasos": [
      "Mezclar secos.",
      "Añadir líquidos.",
      "Batir hasta homogeneizar.",
      "Hornear 25 min."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 74,
    "nombre": "Mousse de Limón Frío",
    "categoria": "rapido",
    "etiquetas": [
      "postres",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "leche condensada",
      "crema leche",
      "limón",
      "galletas"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
    "descripcion": "Postre refrescante de limón, ligero y con textura de aire.",
    "pasos": [
      "Batir leche y crema.",
      "Añadir jugo limón lento.",
      "Poner en copas.",
      "Enfriar 2 horas."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 75,
    "nombre": "Aguacate Relleno de Atún",
    "categoria": "vegetariano",
    "etiquetas": [
      "mariscos",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "aguacate",
      "atún",
      "mayonesa",
      "cebolla",
      "maíz"
    ],
    "tiempo": 10,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
    "descripcion": "Medio aguacate relleno de ensalada de atún cremosa.",
    "pasos": [
      "Preparar mezcla de atún.",
      "Partir aguacate.",
      "Rellenar el hueco.",
      "Servir inmediato."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 76,
    "nombre": "Pasta Primavera con Verduras",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "pasta",
      "calabacín",
      "brócoli",
      "zanahoria",
      "queso"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400&q=80",
    "descripcion": "Pasta corta salteada con verduras de temporada y aceite de oliva.",
    "pasos": [
      "Cocinar pasta.",
      "Saltear verduras picadas.",
      "Mezclar con aceite.",
      "Servir con queso."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 77,
    "nombre": "Burrito de Desayuno Mexicano",
    "categoria": "desayuno",
    "etiquetas": [
      "mexicana",
      "rapida"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "tortilla harina",
      "huevo",
      "frijoles",
      "chorizo",
      "queso"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
    "descripcion": "Tortilla de harina rellena de huevos revueltos, frijoles y chorizo.",
    "pasos": [
      "Sofreír chorizo.",
      "Añadir huevos.",
      "Untar frijol tortilla.",
      "Armar burrito."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 78,
    "nombre": "Parfait de Yogurt y Granola",
    "categoria": "desayuno",
    "etiquetas": [
      "postres",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "yogurt",
      "granola",
      "frutos rojos",
      "miel"
    ],
    "tiempo": 5,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=400&q=80",
    "descripcion": "Capas de yogurt griego, granola crujiente y frutos rojos.",
    "pasos": [
      "Capa de yogurt.",
      "Capa de granola.",
      "Capa de fruta.",
      "Repetir y miel."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 79,
    "nombre": "Omelette de Queso y Hierbas",
    "categoria": "desayuno",
    "etiquetas": [
      "rapida",
      "saludable"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "huevo",
      "queso",
      "cebollín",
      "perejil",
      "mantequilla"
    ],
    "tiempo": 10,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://www.dosanclas.com.ar/wp-content/smush-webp/2021/08/1453388404Dollarphotoclub_84829874-scaled.jpg.webp",
    "descripcion": "Tortilla de huevos francesa, cremosa por dentro y llena de queso.",
    "pasos": [
      "Batir huevos con hierbas.",
      "Verter en sartén caliente.",
      "Poner queso centro.",
      "Doblar a la mitad."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 80,
    "nombre": "Pancakes de Avena y Banano",
    "categoria": "desayuno",
    "etiquetas": [
      "postres",
      "saludable"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "avena",
      "banano",
      "huevo",
      "leche almendras",
      "canela"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80",
    "descripcion": "Tortitas esponjosas sin harina de trigo, hechas con avena y banano maduro.",
    "pasos": [
      "Licuar avena y banano.",
      "Cocinar discos en sartén.",
      "Esperar burbujas y voltear.",
      "Servir con fruta."
    ],
    "calorias": 350,
    "proteina": 20,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 81,
    "nombre": "Tacos de Carnitas",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 29,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/tk%2Fphoto%2F2026%2F02-2026%2F2026-02-carnitas-tacos%2Fcarnitas-tacos-291",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Tacos de Carnitas.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 282,
    "proteina": 31,
    "carbos": 79,
    "grasa": 19
  },
  {
    "id": 82,
    "nombre": "Sushi de Salmón",
    "categoria": "cena",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 23,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://www.kikkoman.es/fileadmin/_processed_/2/9/csm_942-recipe-page-smoked-salmon-and-avocado-roll_desktop_dba1a3c8d9.webp",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Sushi de Salmón.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 283,
    "proteina": 18,
    "carbos": 24,
    "grasa": 28
  },
  {
    "id": 83,
    "nombre": "Pollo al Horno",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 42,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://cocinemosjuntos.com.co/media/mageplaza/blog/post/t/i/tips-para-preparar-pollo-al-horno-jugoso-y-perfecto_1_.jpg",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Pollo al Horno.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 204,
    "proteina": 40,
    "carbos": 52,
    "grasa": 16
  },
  {
    "id": 84,
    "nombre": "Ensalada Rusa",
    "categoria": "rapido",
    "etiquetas": [
      "saludable"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 46,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    "descripcion": "Una delicia de la cocina saludable, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Ensalada Rusa.",
      "Cocinar siguiendo la técnica de la cocina saludable.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 436,
    "proteina": 10,
    "carbos": 22,
    "grasa": 19
  },
  {
    "id": 85,
    "nombre": "Empanadas de Carne",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 60,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Empanadas de Carne.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 343,
    "proteina": 30,
    "carbos": 27,
    "grasa": 5
  },
  {
    "id": 86,
    "nombre": "Postre de Natas",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 48,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://1.bp.blogspot.com/-YNv047PtYcU/VVjwEq5bfNI/AAAAAAAACPE/wrg4-zGtdeU/s1600/Postre%2BNatas%2BSyS3.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Postre de Natas.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 520,
    "proteina": 31,
    "carbos": 25,
    "grasa": 9
  },
  {
    "id": 87,
    "nombre": "Sopa de Picadillo",
    "categoria": "cena",
    "etiquetas": [
      "sopas"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 46,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyfvxx9PA1Su2vSyvfWL5yIVP0Wgv_Fzu0rw&s",
    "descripcion": "Una delicia de la cocina sopas, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Sopa de Picadillo.",
      "Cocinar siguiendo la técnica de la cocina sopas.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 580,
    "proteina": 28,
    "carbos": 50,
    "grasa": 8
  },
  {
    "id": 88,
    "nombre": "Arroz de Mar",
    "categoria": "almuerzo",
    "etiquetas": [
      "mariscos"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 31,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://s1.abcstatics.com/abc/sevilla/media/gurmesevilla/2015/01/arroz-de-mar.jpg",
    "descripcion": "Una delicia de la cocina mariscos, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Arroz de Mar.",
      "Cocinar siguiendo la técnica de la cocina mariscos.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 476,
    "proteina": 12,
    "carbos": 28,
    "grasa": 15
  },
  {
    "id": 89,
    "nombre": "Spaghetti Bolognese",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 39,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/d1b38708de15e20816113dc7c447ab99/Derivates/563c08eba9aa94895a39fb0249fecda402d92e28.jpg",
    "descripcion": "Una delicia de la cocina italiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Spaghetti Bolognese.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 319,
    "proteina": 30,
    "carbos": 68,
    "grasa": 6
  },
  {
    "id": 90,
    "nombre": "Tiramisú",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 46,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOhALzZx6_5tLVhZhY9W8hD871CamGdlBJaw&s",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Tiramisú.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 243,
    "proteina": 40,
    "carbos": 45,
    "grasa": 13
  },
  {
    "id": 91,
    "nombre": "Arepa de Choclo",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 48,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://premier.com.co/wp-content/uploads/2024/04/arepa-de-chocolo-o-choclo.webp",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Arepa de Choclo.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 497,
    "proteina": 22,
    "carbos": 51,
    "grasa": 19
  },
  {
    "id": 92,
    "nombre": "Caldo de Costilla",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 53,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://www.elespectador.com/resizer/v2/SEZQLLQHIBDVNM77ZGOINGUXEQ.jpg?auth=c02900649a41c0fb6fdc0a3a2578042e16306737724e6304247d45a9b38222da&width=920&height=613&smart=true&quality=60",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Caldo de Costilla.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 205,
    "proteina": 29,
    "carbos": 32,
    "grasa": 28
  },
  {
    "id": 93,
    "nombre": "Bowl de Poke",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 25,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/a3/12/56/pokes.jpg?w=900&h=500&s=1",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Bowl de Poke.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 264,
    "proteina": 32,
    "carbos": 64,
    "grasa": 24
  },
  {
    "id": 94,
    "nombre": "Wrap de Falafel",
    "categoria": "cena",
    "etiquetas": [
      "vegana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 25,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnXXwsK9ewS02K8e-9V_1IR_4avrVTPhEcGQ&s",
    "descripcion": "Una delicia de la cocina vegana, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Wrap de Falafel.",
      "Cocinar siguiendo la técnica de la cocina vegana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 230,
    "proteina": 29,
    "carbos": 41,
    "grasa": 14
  },
  {
    "id": 95,
    "nombre": "Smoothie de Mango",
    "categoria": "desayuno",
    "etiquetas": [
      "saludable"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 51,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP8WH2D5BgPHcYgXJzHC_y0W-R3oftIZKlzg&s",
    "descripcion": "Una delicia de la cocina saludable, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Smoothie de Mango.",
      "Cocinar siguiendo la técnica de la cocina saludable.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 256,
    "proteina": 35,
    "carbos": 68,
    "grasa": 30
  },
  {
    "id": 96,
    "nombre": "Huevos Benedictinos",
    "categoria": "desayuno",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 45,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://i.blogs.es/eb0590/huevos-benedictinos/840_560.jpg",
    "descripcion": "Una delicia de la cocina francesa, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Huevos Benedictinos.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 548,
    "proteina": 38,
    "carbos": 40,
    "grasa": 12
  },
  {
    "id": 97,
    "nombre": "Pescado a la Talla",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 28,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Pescado a la Talla.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 267,
    "proteina": 15,
    "carbos": 47,
    "grasa": 8
  },
  {
    "id": 98,
    "nombre": "Chilaquiles",
    "categoria": "desayuno",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 57,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsrtrohNRvs_Xb3jL0r8kYb9mZG0bcVlncjg&s",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Chilaquiles.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 350,
    "proteina": 22,
    "carbos": 24,
    "grasa": 24
  },
  {
    "id": 99,
    "nombre": "Gnocchi de Papa",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 40,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://www.nestleprofessional-latam.com/sites/default/files/styles/np_recipe_detail/public/2023-04/gnocci-con-salsa-bolognesa_0.jpg?itok=nNk_5uzp",
    "descripcion": "Una delicia de la cocina italiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Gnocchi de Papa.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 232,
    "proteina": 33,
    "carbos": 55,
    "grasa": 14
  },
  {
    "id": 100,
    "nombre": "Gelato de Pistacho",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 60,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://www.infobae.com/new-resizer/66WLH6WHghi2xbJKxxGJJrTY58M=/arc-anglerfish-arc2-prod-infobae/public/EPGXX62VOVAIJLQ6B5CR2JSSS4.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Gelato de Pistacho.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 544,
    "proteina": 15,
    "carbos": 73,
    "grasa": 15
  },
  {
    "id": 101,
    "nombre": "Risotto de Espárragos",
    "categoria": "vegetariano",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 26,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
    "descripcion": "Una delicia de la cocina italiana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Risotto de Espárragos.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 507,
    "proteina": 36,
    "carbos": 26,
    "grasa": 11
  },
  {
    "id": 102,
    "nombre": "Tofu Salteado",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 32,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8l25Dik801YHZr630VoBD-1KMl41qpHKlpg&s",
    "descripcion": "Una delicia de la cocina vegana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Tofu Salteado.",
      "Cocinar siguiendo la técnica de la cocina vegana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 592,
    "proteina": 34,
    "carbos": 35,
    "grasa": 17
  },
  {
    "id": 103,
    "nombre": "Sopa de Tomate",
    "categoria": "cena",
    "etiquetas": [
      "sopas"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 24,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://tiaclara.com/wp-content/uploads/2015/05/tortellini-soup-tomato-sopa-de-tomate-recipe-DSC2943.jpg",
    "descripcion": "Una delicia de la cocina sopas, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Sopa de Tomate.",
      "Cocinar siguiendo la técnica de la cocina sopas.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 593,
    "proteina": 36,
    "carbos": 46,
    "grasa": 13
  },
  {
    "id": 104,
    "nombre": "Lasaña de Res",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 31,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&q=80",
    "descripcion": "Una delicia de la cocina italiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Lasaña de Res.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 598,
    "proteina": 31,
    "carbos": 50,
    "grasa": 14
  },
  {
    "id": 105,
    "nombre": "Ceviche de Mango",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 26,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRp8RdnHigjfXD-rou81S0tIuTPr66nYlWFA&s",
    "descripcion": "Una delicia de la cocina vegana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Ceviche de Mango.",
      "Cocinar siguiendo la técnica de la cocina vegana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 364,
    "proteina": 21,
    "carbos": 42,
    "grasa": 20
  },
  {
    "id": 106,
    "nombre": "Patacones con Hogao",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 19,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&q=80",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Patacones con Hogao.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 424,
    "proteina": 26,
    "carbos": 79,
    "grasa": 13
  },
  {
    "id": 107,
    "nombre": "Aborrajados",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 31,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://img-global.cpcdn.com/recipes/a581e372c76017c8/1200x630cq80/photo.jpg",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Aborrajados.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 596,
    "proteina": 23,
    "carbos": 78,
    "grasa": 13
  },
  {
    "id": 108,
    "nombre": "Chuleta Valluna",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 36,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvHK0BnpT7tYg30J3k49TjU32A62KgPm5wlw&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Chuleta Valluna.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 591,
    "proteina": 30,
    "carbos": 60,
    "grasa": 6
  },
  {
    "id": 109,
    "nombre": "Frijolada",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 59,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://caldoparao.com/wp-content/uploads/2020/06/MG_1162.frijolada-jpg.jpg",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Frijolada.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 308,
    "proteina": 16,
    "carbos": 52,
    "grasa": 23
  },
  {
    "id": 110,
    "nombre": "Mote de Queso",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 24,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbvbcx6d0M3xPCTICW72HDugQGUCD2A5dpww&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Mote de Queso.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 531,
    "proteina": 28,
    "carbos": 64,
    "grasa": 15
  },
  {
    "id": 111,
    "nombre": "Puchero",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 20,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmKhwDwZMsot4B0ukDRQQNGC_aVCBU3RtIqA&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Puchero.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 317,
    "proteina": 34,
    "carbos": 28,
    "grasa": 15
  },
  {
    "id": 112,
    "nombre": "Arroz Atollado",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 34,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.elespectador.com/resizer/v2/SF5YWFYO5FD4PAZHWTVBG2PMVI.jpg?auth=a5a302c3288d206171087af51a675009dc637b579d36c5af2da6ef0a8b8201a8&width=1200&height=675&smart=true&quality=80",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Arroz Atollado.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 266,
    "proteina": 37,
    "carbos": 75,
    "grasa": 26
  },
  {
    "id": 113,
    "nombre": "Sobrebarriga al Horno",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 51,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://cdn.colombia.com/gastronomia/2011/08/01/sobrebarriga-al-horno-1702.gif",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Sobrebarriga al Horno.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 534,
    "proteina": 37,
    "carbos": 38,
    "grasa": 24
  },
  {
    "id": 114,
    "nombre": "Bagre en Salsa",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 30,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://cdn.colombia.com/gastronomia/2017/05/10/bagre-en-salsa-1607.gif",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Bagre en Salsa.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 255,
    "proteina": 39,
    "carbos": 80,
    "grasa": 24
  },
  {
    "id": 115,
    "nombre": "Viuda de Pescado",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 36,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Viuda de Pescado.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 534,
    "proteina": 15,
    "carbos": 36,
    "grasa": 10
  },
  {
    "id": 116,
    "nombre": "Arroz con Coco y Pescado",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 46,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Arroz con Coco y Pescado.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 308,
    "proteina": 12,
    "carbos": 59,
    "grasa": 17
  },
  {
    "id": 117,
    "nombre": "Cazuela de Frijoles",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 32,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0AY09bzV-x0ClwYMSYZwWHBT4J-bDpn6klQ&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Cazuela de Frijoles.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 446,
    "proteina": 37,
    "carbos": 37,
    "grasa": 7
  },
  {
    "id": 118,
    "nombre": "Tamal Santandereano",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 18,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://www.elespectador.com/resizer/v2/XMZOLD4LWZGJRORWLFWOJ4X26E.png?auth=9eb8acb81e419ef8f8fc4bbc976f539d5441f9c669cae337fb3459ec211b3df9&width=920&height=613&smart=true&quality=60",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Tamal Santandereano.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 570,
    "proteina": 10,
    "carbos": 68,
    "grasa": 27
  },
  {
    "id": 119,
    "nombre": "Ayaco",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 57,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiroheEKVJkmZBO5L8z-fGxVPQ2yoeOPqMsQ&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Ayaco.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 329,
    "proteina": 12,
    "carbos": 72,
    "grasa": 12
  },
  {
    "id": 120,
    "nombre": "Sancocho de Pescado",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 21,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Sancocho de Pescado.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 358,
    "proteina": 11,
    "carbos": 47,
    "grasa": 19
  },
  {
    "id": 121,
    "nombre": "Mondongo",
    "categoria": "almuerzo",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 56,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEc5tFzEB544jf_z9H9sBGa8LASQ9zxqv9Bw&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Mondongo.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 282,
    "proteina": 12,
    "carbos": 33,
    "grasa": 25
  },
  {
    "id": 122,
    "nombre": "Caldo de Pescado",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 55,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Caldo de Pescado.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 580,
    "proteina": 16,
    "carbos": 44,
    "grasa": 26
  },
  {
    "id": 123,
    "nombre": "Aguapanela con Queso",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 35,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://vecinavegetariana.com/wp-content/uploads/2022/04/Aguapanela-Colombiana-3-2.jpeg",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Aguapanela con Queso.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 322,
    "proteina": 10,
    "carbos": 43,
    "grasa": 21
  },
  {
    "id": 124,
    "nombre": "Chocolate con Almojábana",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 42,
    "dificultad": "Media",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuRF3Yj0Lpf6lGCFYZqopPs60ZhhJfbs64qw&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Chocolate con Almojábana.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 295,
    "proteina": 23,
    "carbos": 51,
    "grasa": 29
  },
  {
    "id": 125,
    "nombre": "Pandeyuca",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 48,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXFpkXksXWwl-7yHX5WboUNvb6gkwW7WGkcg&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Pandeyuca.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 496,
    "proteina": 17,
    "carbos": 80,
    "grasa": 30
  },
  {
    "id": 126,
    "nombre": "Buñuelos",
    "categoria": "desayuno",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 19,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://cloudfront-us-east-1.images.arcpublishing.com/semana/UZ6CTKCBRNBCXJW4MESFCEQYIY.jpg",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Buñuelos.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 465,
    "proteina": 28,
    "carbos": 34,
    "grasa": 28
  },
  {
    "id": 127,
    "nombre": "Natilla",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 56,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0XF8mMXPfcebzdp7PEIJpA6pv0eIk8O5YTg&s",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Natilla.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 483,
    "proteina": 32,
    "carbos": 78,
    "grasa": 15
  },
  {
    "id": 128,
    "nombre": "Arroz con Leche",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 47,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Arroz con Leche.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 575,
    "proteina": 38,
    "carbos": 69,
    "grasa": 12
  },
  {
    "id": 129,
    "nombre": "Leche Asada",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 22,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://cdn0.recetasgratis.net/es/posts/6/0/5/leche_asada_con_leche_condensada_77506_paso_10_600.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Leche Asada.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 568,
    "proteina": 18,
    "carbos": 47,
    "grasa": 7
  },
  {
    "id": 130,
    "nombre": "Brevas con Arequipe",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 37,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/2HDQYQE6RNA6TIPMWG2ORDERA4.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Brevas con Arequipe.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 380,
    "proteina": 10,
    "carbos": 55,
    "grasa": 10
  },
  {
    "id": 131,
    "nombre": "Mazamorra",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 42,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAnucHkAHJZDwKVTHQhUOIF3Yn_8vxTlLVrA&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Mazamorra.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 305,
    "proteina": 29,
    "carbos": 76,
    "grasa": 12
  },
  {
    "id": 132,
    "nombre": "Salpicón",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 19,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.mycolombianrecipes.com/wp-content/uploads/2009/02/salpicon-colombiano1.jpg",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Salpicón.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 337,
    "proteina": 38,
    "carbos": 71,
    "grasa": 17
  },
  {
    "id": 133,
    "nombre": "Jugos Naturales",
    "categoria": "rapido",
    "etiquetas": [
      "saludable"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 17,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS26fgdytfcmPq43MZMgU6aj7ubGbCu6JrHw&s",
    "descripcion": "Una delicia de la cocina saludable, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Jugos Naturales.",
      "Cocinar siguiendo la técnica de la cocina saludable.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 480,
    "proteina": 15,
    "carbos": 71,
    "grasa": 22
  },
  {
    "id": 134,
    "nombre": "Guacamole con Totopos",
    "categoria": "rapido",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 37,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&q=80",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Guacamole con Totopos.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 211,
    "proteina": 17,
    "carbos": 69,
    "grasa": 13
  },
  {
    "id": 135,
    "nombre": "Tacos de Cochinita Pibil",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 43,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkUv2x9QJ-6ALz9nhQd0sOz-o9SBpCYsTwOQ&s",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Tacos de Cochinita Pibil.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 274,
    "proteina": 16,
    "carbos": 32,
    "grasa": 16
  },
  {
    "id": 136,
    "nombre": "Enchiladas Verdes",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 54,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.mylatinatable.com/wp-content/uploads/2018/09/enchiladas-foto-heroe-500x375.jpg",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Enchiladas Verdes.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 382,
    "proteina": 30,
    "carbos": 50,
    "grasa": 14
  },
  {
    "id": 137,
    "nombre": "Pozole Rojo",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 21,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu3fjcbtlBiqgKx1VIH0cR1Eaog-JNjPqjmg&s",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Pozole Rojo.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 478,
    "proteina": 14,
    "carbos": 72,
    "grasa": 18
  },
  {
    "id": 138,
    "nombre": "Chiles en Nogada",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 35,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC4XWWFTKeuhNmjZOgXwnDMVTctxA0GYt09w&s",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Chiles en Nogada.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 333,
    "proteina": 20,
    "carbos": 61,
    "grasa": 19
  },
  {
    "id": 139,
    "nombre": "Mole Poblano",
    "categoria": "almuerzo",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 20,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://donzabor.mx/cdn/shop/articles/donzabor-blog-mole.jpg?v=1595956753&width=3000",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Mole Poblano.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 209,
    "proteina": 25,
    "carbos": 60,
    "grasa": 14
  },
  {
    "id": 140,
    "nombre": "Tamales Mexicanos",
    "categoria": "desayuno",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 19,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&q=80",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Tamales Mexicanos.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 440,
    "proteina": 34,
    "carbos": 52,
    "grasa": 29
  },
  {
    "id": 141,
    "nombre": "Flan de Caramelo",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 46,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://d1uz88p17r663j.cloudfront.net/original/fcef366cb9f5135bc254be335da4862c_49._Flan_de_Caramelo_1.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Flan de Caramelo.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 522,
    "proteina": 16,
    "carbos": 75,
    "grasa": 9
  },
  {
    "id": 142,
    "nombre": "Churros con Chocolate",
    "categoria": "rapido",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 38,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNad2_z9Nk1tlasSajt7ZamMC_uiemXHth2A&s",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Churros con Chocolate.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 325,
    "proteina": 40,
    "carbos": 46,
    "grasa": 28
  },
  {
    "id": 143,
    "nombre": "Burrito Vegano",
    "categoria": "cena",
    "etiquetas": [
      "vegana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 20,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
    "descripcion": "Una delicia de la cocina vegana, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Burrito Vegano.",
      "Cocinar siguiendo la técnica de la cocina vegana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 305,
    "proteina": 24,
    "carbos": 23,
    "grasa": 20
  },
  {
    "id": 144,
    "nombre": "Nachos Supremos",
    "categoria": "rapido",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 30,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeUlNc81-BWobWBlwxkNfv1fRGjb-NT3IPsw&s",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Nachos Supremos.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 259,
    "proteina": 37,
    "carbos": 44,
    "grasa": 20
  },
  {
    "id": 145,
    "nombre": "Quesadilla de Flor de Calabaza",
    "categoria": "vegetariano",
    "etiquetas": [
      "mexicana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 26,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjqPqJM3LesM_Ge1YK09ZxP11Ud0sTgclpXA&s",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Quesadilla de Flor de Calabaza.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 264,
    "proteina": 39,
    "carbos": 22,
    "grasa": 23
  },
  {
    "id": 146,
    "nombre": "Sopa Azteca",
    "categoria": "sopas",
    "etiquetas": [
      "mexicana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 58,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
    "descripcion": "Una delicia de la cocina mexicana, perfecta para sopas.",
    "pasos": [
      "Preparar los elementos para Sopa Azteca.",
      "Cocinar siguiendo la técnica de la cocina mexicana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo sopas."
    ],
    "calorias": 492,
    "proteina": 27,
    "carbos": 67,
    "grasa": 22
  },
  {
    "id": 147,
    "nombre": "Pescado al Vapor",
    "categoria": "saludable",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 23,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para saludable.",
    "pasos": [
      "Preparar los elementos para Pescado al Vapor.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo saludable."
    ],
    "calorias": 299,
    "proteina": 24,
    "carbos": 29,
    "grasa": 25
  },
  {
    "id": 148,
    "nombre": "Ramen de Cerdo",
    "categoria": "cena",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 29,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Ramen de Cerdo.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 498,
    "proteina": 17,
    "carbos": 65,
    "grasa": 27
  },
  {
    "id": 149,
    "nombre": "Dumplings de Verdura",
    "categoria": "rapido",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 21,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFkF9K4N7O8drE3x9IrGBEAeUvtcC1tyI4qg&s",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Dumplings de Verdura.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 297,
    "proteina": 40,
    "carbos": 78,
    "grasa": 28
  },
  {
    "id": 150,
    "nombre": "Pollo Kung Pao",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 16,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk3_riI00P2hILI2m3WxaaMZad8tID6cSNlQ&s",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Pollo Kung Pao.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 495,
    "proteina": 38,
    "carbos": 46,
    "grasa": 7
  },
  {
    "id": 151,
    "nombre": "Pato Laqueado",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 31,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4xC7ikfwyuJJKnmOzBHg8VEDRp7LcwLnoFw&s",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Pato Laqueado.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 450,
    "proteina": 27,
    "carbos": 52,
    "grasa": 15
  },
  {
    "id": 152,
    "nombre": "Bibimbap",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 50,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Bibimbap.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 401,
    "proteina": 17,
    "carbos": 58,
    "grasa": 24
  },
  {
    "id": 153,
    "nombre": "Kimchi casero",
    "categoria": "vegetariano",
    "etiquetas": [
      "asiatica",
      "vegetariano"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 46,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9JdOcCDb26jtXE07sMbYw3pDLWr7Sd4MQUA&s",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Kimchi casero.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 249,
    "proteina": 25,
    "carbos": 34,
    "grasa": 16
  },
  {
    "id": 154,
    "nombre": "Tempura de Vegetales",
    "categoria": "vegetariano",
    "etiquetas": [
      "asiatica",
      "vegetariano"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 49,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxgNQUwMqjs-wGQigHClrdYSBP1KGzpYhK8g&s",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Tempura de Vegetales.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 508,
    "proteina": 14,
    "carbos": 59,
    "grasa": 28
  },
  {
    "id": 155,
    "nombre": "Yakitori de Pollo",
    "categoria": "cena",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 21,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://i.blogs.es/fc7b31/yakitori-de-pollo/650_1200.jpg",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Yakitori de Pollo.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 492,
    "proteina": 13,
    "carbos": 42,
    "grasa": 22
  },
  {
    "id": 156,
    "nombre": "Sopa Tom Yum",
    "categoria": "sopas",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 49,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para sopas.",
    "pasos": [
      "Preparar los elementos para Sopa Tom Yum.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo sopas."
    ],
    "calorias": 453,
    "proteina": 23,
    "carbos": 70,
    "grasa": 19
  },
  {
    "id": 157,
    "nombre": "Green Curry",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 47,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://hot-thai-kitchen.com/wp-content/uploads/2022/04/Green-curry-chicken-sq-2.jpg",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Green Curry.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 278,
    "proteina": 27,
    "carbos": 67,
    "grasa": 27
  },
  {
    "id": 158,
    "nombre": "Mango Sticky Rice",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 42,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://www.allrecipes.com/thmb/iNGV8JdDD9jrmmIFU-k-SmqUst8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-150313-thai-sweet-sticky-rice-with-mango-khao-neeo-mamuang-ddmfs-1x2-hero-0e40dae3393645e28e6ca2018dc17e84.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Mango Sticky Rice.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 401,
    "proteina": 38,
    "carbos": 74,
    "grasa": 25
  },
  {
    "id": 159,
    "nombre": "Spring Rolls",
    "categoria": "rapido",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 35,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Spring Rolls.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 241,
    "proteina": 27,
    "carbos": 40,
    "grasa": 15
  },
  {
    "id": 160,
    "nombre": "Banh Mi",
    "categoria": "rapido",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 48,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://hips.hearstapps.com/hmg-prod/images/banh-mi-with-grilled-pork1-1663331872.jpg?crop=0.683xw:1.00xh;0.317xw,0&resize=1200:*",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Banh Mi.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 216,
    "proteina": 40,
    "carbos": 50,
    "grasa": 28
  },
  {
    "id": 161,
    "nombre": "Pho Bo",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 36,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/DE1752E4-0B71-4F56-8D65-8DE586E0B930/Derivates/E501E84F-FD9A-40D9-AC4A-B6ECC7AB4882.jpg",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Pho Bo.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 532,
    "proteina": 30,
    "carbos": 33,
    "grasa": 10
  },
  {
    "id": 162,
    "nombre": "Nems de Cerdo",
    "categoria": "rapido",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 51,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://www.gastronosfera.com/sites/default/files/uploads/2014/06/nems1.jpg",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Nems de Cerdo.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 590,
    "proteina": 22,
    "carbos": 65,
    "grasa": 10
  },
  {
    "id": 163,
    "nombre": "Pizza Calzone",
    "categoria": "cena",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 28,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
    "descripcion": "Una delicia de la cocina italiana, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Pizza Calzone.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 454,
    "proteina": 39,
    "carbos": 77,
    "grasa": 23
  },
  {
    "id": 164,
    "nombre": "Focaccia de Romero",
    "categoria": "rapido",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 27,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAaW71XK5f_wqg4mIQFmA4iPskASlRIhiOmA&s",
    "descripcion": "Una delicia de la cocina italiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Focaccia de Romero.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 320,
    "proteina": 33,
    "carbos": 51,
    "grasa": 19
  },
  {
    "id": 165,
    "nombre": "Minestrone",
    "categoria": "sopas",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 49,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
    "descripcion": "Una delicia de la cocina italiana, perfecta para sopas.",
    "pasos": [
      "Preparar los elementos para Minestrone.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo sopas."
    ],
    "calorias": 598,
    "proteina": 18,
    "carbos": 67,
    "grasa": 27
  },
  {
    "id": 166,
    "nombre": "Ossobuco",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 50,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYpnB_OlaK1vNUoAeIlLTcM9EpX89hcIQ99Q&s",
    "descripcion": "Una delicia de la cocina italiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Ossobuco.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 514,
    "proteina": 20,
    "carbos": 57,
    "grasa": 27
  },
  {
    "id": 167,
    "nombre": "Pollo a la Cacciatora",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 36,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://www.recetasnestle.com.do/sites/default/files/srh_recipes/367075204da5524a8659cd8c9d516d17.jpg",
    "descripcion": "Una delicia de la cocina italiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Pollo a la Cacciatora.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 544,
    "proteina": 29,
    "carbos": 21,
    "grasa": 28
  },
  {
    "id": 168,
    "nombre": "Carpaccio de Res",
    "categoria": "cena",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-mariscos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 53,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://www.cocinadelirante.com/800x600/filters:format(webp):quality(75)/sites/default/files/images/2025/04/carapaccio-res.jpg",
    "descripcion": "Una delicia de la cocina italiana, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Carpaccio de Res.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 313,
    "proteina": 35,
    "carbos": 27,
    "grasa": 27
  },
  {
    "id": 169,
    "nombre": "Bruschettas de Tomate",
    "categoria": "rapido",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 43,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.simplyorganic.com/media/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg",
    "descripcion": "Una delicia de la cocina italiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Bruschettas de Tomate.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 235,
    "proteina": 36,
    "carbos": 80,
    "grasa": 30
  },
  {
    "id": 170,
    "nombre": "Cannoli Siciliani",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 43,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://www.giallozafferano.es/images/2-256/Cannoli-siciliani_650x433_wm.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Cannoli Siciliani.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 426,
    "proteina": 19,
    "carbos": 65,
    "grasa": 10
  },
  {
    "id": 171,
    "nombre": "Panna Cotta",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 31,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://static01.nyt.com/images/2023/08/10/multimedia/LH-Panna-Cotta-wczm/LH-Panna-Cotta-wczm-videoSixteenByNineJumbo1600.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Panna Cotta.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 307,
    "proteina": 31,
    "carbos": 79,
    "grasa": 21
  },
  {
    "id": 172,
    "nombre": "Gelato de Vainilla",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 43,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr0WC2X229xaZwPoGWUGUHTm8Kzy4LIIuCHQ&s",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Gelato de Vainilla.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 492,
    "proteina": 36,
    "carbos": 42,
    "grasa": 19
  },
  {
    "id": 173,
    "nombre": "Pasta Putanesca",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 49,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/ZPH2CSEEF5GFFPV2QTDD7PXPZA.jpeg",
    "descripcion": "Una delicia de la cocina italiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Pasta Putanesca.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 508,
    "proteina": 28,
    "carbos": 30,
    "grasa": 30
  },
  {
    "id": 174,
    "nombre": "Risotto Nero",
    "categoria": "almuerzo",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 29,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
    "descripcion": "Una delicia de la cocina italiana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Risotto Nero.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 286,
    "proteina": 23,
    "carbos": 58,
    "grasa": 16
  },
  {
    "id": 175,
    "nombre": "Bistecca alla Fiorentina",
    "categoria": "parrilla",
    "etiquetas": [
      "italiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 53,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80",
    "descripcion": "Una delicia de la cocina italiana, perfecta para parrilla.",
    "pasos": [
      "Preparar los elementos para Bistecca alla Fiorentina.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo parrilla."
    ],
    "calorias": 591,
    "proteina": 10,
    "carbos": 52,
    "grasa": 15
  },
  {
    "id": 176,
    "nombre": "Pasta Primavera",
    "categoria": "vegetariano",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 29,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400&q=80",
    "descripcion": "Una delicia de la cocina italiana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Pasta Primavera.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 213,
    "proteina": 23,
    "carbos": 23,
    "grasa": 12
  },
  {
    "id": 177,
    "nombre": "Ratatouille",
    "categoria": "vegetariano",
    "etiquetas": [
      "francesa",
      "vegetariano"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 28,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.kikkoman.es/fileadmin/_processed_/1/8/csm_1075-recipe-page-Saffron-scented-Ratatouille_desktop_5ddfe5fdbf.jpg",
    "descripcion": "Una delicia de la cocina francesa, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Ratatouille.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 485,
    "proteina": 27,
    "carbos": 53,
    "grasa": 9
  },
  {
    "id": 178,
    "nombre": "Quiche Lorraine",
    "categoria": "almuerzo",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 45,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO2O27iMdcn-ECCxFS7xvx1pYkIM3bqhGF7Q&s",
    "descripcion": "Una delicia de la cocina francesa, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Quiche Lorraine.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 322,
    "proteina": 16,
    "carbos": 75,
    "grasa": 24
  },
  {
    "id": 179,
    "nombre": "Sopa de Cebolla",
    "categoria": "sopas",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 32,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
    "descripcion": "Una delicia de la cocina francesa, perfecta para sopas.",
    "pasos": [
      "Preparar los elementos para Sopa de Cebolla.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo sopas."
    ],
    "calorias": 364,
    "proteina": 18,
    "carbos": 79,
    "grasa": 6
  },
  {
    "id": 180,
    "nombre": "Boeuf Bourguignon",
    "categoria": "almuerzo",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 55,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloIMsCvHcLYzhzw8gs6nnbuyUhRqSIhNoYQ&s",
    "descripcion": "Una delicia de la cocina francesa, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Boeuf Bourguignon.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 285,
    "proteina": 37,
    "carbos": 79,
    "grasa": 19
  },
  {
    "id": 181,
    "nombre": "Coq au Vin",
    "categoria": "almuerzo",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 59,
    "dificultad": "Media",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiAPk0WpfbMRtCY-bxVKZWG0usZ0tYVLAeYQ&s",
    "descripcion": "Una delicia de la cocina francesa, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Coq au Vin.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 355,
    "proteina": 25,
    "carbos": 28,
    "grasa": 28
  },
  {
    "id": 182,
    "nombre": "Crêpes Salées",
    "categoria": "cena",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 38,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/974D51E6-4766-4C59-A694-ECC3939E5C29/Derivates/5B0C43B3-3615-46D3-84A7-5FFB2CDC7B2E.jpg",
    "descripcion": "Una delicia de la cocina francesa, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Crêpes Salées.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 452,
    "proteina": 40,
    "carbos": 42,
    "grasa": 29
  },
  {
    "id": 183,
    "nombre": "Crêpes Sucrées",
    "categoria": "postres",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 43,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
    "descripcion": "Una delicia de la cocina francesa, perfecta para postres.",
    "pasos": [
      "Preparar los elementos para Crêpes Sucrées.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo postres."
    ],
    "calorias": 563,
    "proteina": 40,
    "carbos": 35,
    "grasa": 7
  },
  {
    "id": 184,
    "nombre": "Macarons",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 52,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://www.recetasnestle.com.co/sites/default/files/styles/crop_article_banner_desktop_nes/public/2023-08/cuatro-macarons-colores.jpg?itok=GJzR_Lcd",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Macarons.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 578,
    "proteina": 24,
    "carbos": 41,
    "grasa": 22
  },
  {
    "id": 185,
    "nombre": "Profiteroles",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 41,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://i.blogs.es/7ca344/profiteroles-crema/1200_900.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Profiteroles.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 596,
    "proteina": 37,
    "carbos": 24,
    "grasa": 13
  },
  {
    "id": 186,
    "nombre": "Tartiflette",
    "categoria": "cena",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 36,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQNanj6OrifxfqOxeKyPu45UjNq1CwD6EYqA&s",
    "descripcion": "Una delicia de la cocina francesa, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Tartiflette.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 345,
    "proteina": 17,
    "carbos": 66,
    "grasa": 20
  },
  {
    "id": 187,
    "nombre": "Cassoulet",
    "categoria": "almuerzo",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 56,
    "dificultad": "Media",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToMqSzGBpJxvIceTpPGQGH21Wni9OfVhbWdQ&s",
    "descripcion": "Una delicia de la cocina francesa, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Cassoulet.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 549,
    "proteina": 32,
    "carbos": 41,
    "grasa": 8
  },
  {
    "id": 188,
    "nombre": "Soufflé de Queso",
    "categoria": "cena",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 26,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://i.blogs.es/df33ce/souffle-de-queso-y-pimiento/840_560.jpg",
    "descripcion": "Una delicia de la cocina francesa, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Soufflé de Queso.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 273,
    "proteina": 27,
    "carbos": 73,
    "grasa": 11
  },
  {
    "id": 189,
    "nombre": "Ceviche Clásico",
    "categoria": "almuerzo",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 30,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSSFz0CeE_U6b-pmVsMek1R9ehmaGkka4sGg&s",
    "descripcion": "Una delicia de la cocina peruana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Ceviche Clásico.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 499,
    "proteina": 28,
    "carbos": 50,
    "grasa": 12
  },
  {
    "id": 190,
    "nombre": "Tiradito de Pescado",
    "categoria": "almuerzo",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 30,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Una delicia de la cocina peruana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Tiradito de Pescado.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 582,
    "proteina": 23,
    "carbos": 63,
    "grasa": 9
  },
  {
    "id": 191,
    "nombre": "Causa Limeña",
    "categoria": "almuerzo",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 24,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfHWy0amB5ltIte3NgxJUhtlMycp8E17S1Iw&s",
    "descripcion": "Una delicia de la cocina peruana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Causa Limeña.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 411,
    "proteina": 19,
    "carbos": 72,
    "grasa": 11
  },
  {
    "id": 192,
    "nombre": "Anticuchos de Corazón",
    "categoria": "parrilla",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 30,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://rumbameats.com/wp-content/uploads/2019/07/Anticuchos-1.jpg",
    "descripcion": "Una delicia de la cocina peruana, perfecta para parrilla.",
    "pasos": [
      "Preparar los elementos para Anticuchos de Corazón.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo parrilla."
    ],
    "calorias": 256,
    "proteina": 32,
    "carbos": 21,
    "grasa": 10
  },
  {
    "id": 193,
    "nombre": "Ají de Gallina",
    "categoria": "almuerzo",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 21,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://cdn0.recetasgratis.net/es/posts/4/3/0/aji_de_gallina_peruano_78034_1200.jpg",
    "descripcion": "Una delicia de la cocina peruana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Ají de Gallina.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 387,
    "proteina": 23,
    "carbos": 20,
    "grasa": 6
  },
  {
    "id": 194,
    "nombre": "Papa a la Huancaína",
    "categoria": "vegetariano",
    "etiquetas": [
      "peruana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 30,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://i.ytimg.com/vi/9rHZ4I_HRRw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBw7SgnDtFyaL04E40y4S9kesozRg",
    "descripcion": "Una delicia de la cocina peruana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Papa a la Huancaína.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 534,
    "proteina": 37,
    "carbos": 45,
    "grasa": 28
  },
  {
    "id": 195,
    "nombre": "Arroz con Pato",
    "categoria": "almuerzo",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 28,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://comedera.com/wp-content/uploads/sites/9/2022/05/Arroz-con-pato-peruano-shutterstock_1846729603.jpg?w=500&h=375&crop=1",
    "descripcion": "Una delicia de la cocina peruana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Arroz con Pato.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 253,
    "proteina": 11,
    "carbos": 35,
    "grasa": 9
  },
  {
    "id": 196,
    "nombre": "Seco de Cordero",
    "categoria": "almuerzo",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 56,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn4bly9EUf2yj9R8_ELapZQhtXhc1KlTY30Q&s",
    "descripcion": "Una delicia de la cocina peruana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Seco de Cordero.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 474,
    "proteina": 38,
    "carbos": 68,
    "grasa": 17
  },
  {
    "id": 197,
    "nombre": "Tacu Tacu",
    "categoria": "almuerzo",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 54,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.ajinomoto.com/cms_wp_ajnmt_global/wp-content/uploads/umamirecipes/jpg/a344e974fbc5d8e979ec0e649ab09ae7-1-1200x630.jpg",
    "descripcion": "Una delicia de la cocina peruana, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Tacu Tacu.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 514,
    "proteina": 30,
    "carbos": 30,
    "grasa": 8
  },
  {
    "id": 198,
    "nombre": "Suspiro Limeño",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 45,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://cdn0.recetasgratis.net/es/posts/2/6/2/suspiro_limeno_78262_paso_7_600.jpg",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Suspiro Limeño.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 428,
    "proteina": 17,
    "carbos": 69,
    "grasa": 18
  },
  {
    "id": 199,
    "nombre": "Mazamorra Morada",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 15,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Mazamorra Morada.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 376,
    "proteina": 38,
    "carbos": 58,
    "grasa": 15
  },
  {
    "id": 200,
    "nombre": "Pisco Sour (Coctel)",
    "categoria": "rapido",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 51,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://res.cloudinary.com/htt8g4cd/image/upload/wp/01_24_pisco_sour_hero_gettyimages-1127875483_1920x1280",
    "descripcion": "Una delicia de la cocina peruana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Pisco Sour (Coctel).",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 279,
    "proteina": 10,
    "carbos": 22,
    "grasa": 8
  },
  {
    "id": 201,
    "nombre": "Pollo a la Brasa",
    "categoria": "parrilla",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [
      "sin-lactosa",
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 21,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://www.eatperu.com/wp-content/uploads/2019/10/pollo-a-la-brasa-with-salad-and-dipping-sauces.jpg",
    "descripcion": "Una delicia de la cocina peruana, perfecta para parrilla.",
    "pasos": [
      "Preparar los elementos para Pollo a la Brasa.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo parrilla."
    ],
    "calorias": 382,
    "proteina": 30,
    "carbos": 51,
    "grasa": 16
  },
  {
    "id": 202,
    "nombre": "Chupe de Camarones",
    "categoria": "sopas",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 37,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
    "descripcion": "Una delicia de la cocina peruana, perfecta para sopas.",
    "pasos": [
      "Preparar los elementos para Chupe de Camarones.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo sopas."
    ],
    "calorias": 380,
    "proteina": 32,
    "carbos": 59,
    "grasa": 30
  },
  {
    "id": 203,
    "nombre": "Humitas",
    "categoria": "desayuno",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 46,
    "dificultad": "Media",
    "porciones": 1,
    "match": 0,
    "imagen": "https://cdn0.recetasgratis.net/es/posts/7/0/0/humitas_chilenas_78007_1200.jpg",
    "descripcion": "Una delicia de la cocina peruana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Humitas.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 366,
    "proteina": 19,
    "carbos": 29,
    "grasa": 8
  },
  {
    "id": 204,
    "nombre": "Tamal Peruano",
    "categoria": "desayuno",
    "etiquetas": [
      "peruana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 15,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://comedera.com/wp-content/uploads/sites/9/2022/07/Tamal-de-pollo-peruano-shutterstock_1447949078.jpg",
    "descripcion": "Una delicia de la cocina peruana, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Tamal Peruano.",
      "Cocinar siguiendo la técnica de la cocina peruana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 443,
    "proteina": 24,
    "carbos": 72,
    "grasa": 25
  },
  {
    "id": 205,
    "nombre": "Salmón Teriyaki",
    "categoria": "almuerzo",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 57,
    "dificultad": "Media",
    "porciones": 1,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Salmón Teriyaki.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 473,
    "proteina": 36,
    "carbos": 43,
    "grasa": 27
  },
  {
    "id": 206,
    "nombre": "Steak Tartare",
    "categoria": "cena",
    "etiquetas": [
      "francesa"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 30,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZJkENgVRPVqjCcsetpsu0KcU8DPcpNebmw&s",
    "descripcion": "Una delicia de la cocina francesa, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Steak Tartare.",
      "Cocinar siguiendo la técnica de la cocina francesa.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 442,
    "proteina": 23,
    "carbos": 23,
    "grasa": 25
  },
  {
    "id": 207,
    "nombre": "Moussaka",
    "categoria": "almuerzo",
    "etiquetas": [
      "vegetariano"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 17,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLM3UNbSRYpRPH9ZgbUMiEdgftogXwS3Yvkg&s",
    "descripcion": "Una delicia de la cocina vegetariano, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Moussaka.",
      "Cocinar siguiendo la técnica de la cocina vegetariano.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 505,
    "proteina": 21,
    "carbos": 34,
    "grasa": 17
  },
  {
    "id": 208,
    "nombre": "Falafel",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 31,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/D036C31A-9CE0-4903-BF89-FC97B374DABF/Derivates/51d0a4e9-c4f5-4714-9cf5-26afeb270129.jpg",
    "descripcion": "Una delicia de la cocina vegana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Falafel.",
      "Cocinar siguiendo la técnica de la cocina vegana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 280,
    "proteina": 38,
    "carbos": 79,
    "grasa": 11
  },
  {
    "id": 209,
    "nombre": "Kebab de Cordero",
    "categoria": "cena",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 33,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvfB_sJpFmznCAxEAmMvPQnOIxDB1PCoQmzw&s",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Kebab de Cordero.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 528,
    "proteina": 31,
    "carbos": 42,
    "grasa": 25
  },
  {
    "id": 210,
    "nombre": "Paella de Verduras",
    "categoria": "vegetariano",
    "etiquetas": [
      "italiana",
      "vegetariano"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 55,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ49cQl2hV3tofirXYC6UsPkEpMTyUsHBTd8w&s",
    "descripcion": "Una delicia de la cocina italiana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Paella de Verduras.",
      "Cocinar siguiendo la técnica de la cocina italiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 416,
    "proteina": 38,
    "carbos": 60,
    "grasa": 12
  },
  {
    "id": 211,
    "nombre": "Cuscús con Vegetales",
    "categoria": "vegetariano",
    "etiquetas": [
      "saludable",
      "vegetariano"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 46,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWG5hcivY_2hHnpl7G3O8IRSNayQI8OQnEw&s",
    "descripcion": "Una delicia de la cocina saludable, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Cuscús con Vegetales.",
      "Cocinar siguiendo la técnica de la cocina saludable.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 328,
    "proteina": 30,
    "carbos": 39,
    "grasa": 7
  },
  {
    "id": 212,
    "nombre": "Hamburguesa de Garbanzos",
    "categoria": "vegetariano",
    "etiquetas": [
      "vegana",
      "vegetariano"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 31,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://i.blogs.es/7c533c/dap2/450_1000.jpg",
    "descripcion": "Una delicia de la cocina vegana, perfecta para vegetariano.",
    "pasos": [
      "Preparar los elementos para Hamburguesa de Garbanzos.",
      "Cocinar siguiendo la técnica de la cocina vegana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo vegetariano."
    ],
    "calorias": 345,
    "proteina": 29,
    "carbos": 72,
    "grasa": 23
  },
  {
    "id": 213,
    "nombre": "Tostadas con Aguacate",
    "categoria": "desayuno",
    "etiquetas": [
      "saludable"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 28,
    "dificultad": "Fácil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://veggiefestchicago.org/wp-content/uploads/2018/12/BreadAvocato2.jpg",
    "descripcion": "Una delicia de la cocina saludable, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Tostadas con Aguacate.",
      "Cocinar siguiendo la técnica de la cocina saludable.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 464,
    "proteina": 26,
    "carbos": 38,
    "grasa": 5
  },
  {
    "id": 214,
    "nombre": "Smoothie Bowl",
    "categoria": "desayuno",
    "etiquetas": [
      "saludable"
    ],
    "restricciones": [
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 52,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://www.budgetbytes.com/wp-content/uploads/2025/01/Smoothie-Bowl-Overhead-500x500.jpg",
    "descripcion": "Una delicia de la cocina saludable, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Smoothie Bowl.",
      "Cocinar siguiendo la técnica de la cocina saludable.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 353,
    "proteina": 23,
    "carbos": 28,
    "grasa": 29
  },
  {
    "id": 215,
    "nombre": "Granola Casera",
    "categoria": "desayuno",
    "etiquetas": [
      "saludable"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 35,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_VVVBqcUG6pYBmLs3vGc6-Olon-Pt3XzO3g&s",
    "descripcion": "Una delicia de la cocina saludable, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Granola Casera.",
      "Cocinar siguiendo la técnica de la cocina saludable.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 435,
    "proteina": 10,
    "carbos": 58,
    "grasa": 8
  },
  {
    "id": 216,
    "nombre": "Chia Pudding",
    "categoria": "desayuno",
    "etiquetas": [
      "saludable"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 15,
    "dificultad": "Media",
    "porciones": 4,
    "match": 0,
    "imagen": "https://deliciaskitchen.b-cdn.net/wp-content/uploads/2015/07/pudin-de-chia-chia-pudding.jpg",
    "descripcion": "Una delicia de la cocina saludable, perfecta para desayuno.",
    "pasos": [
      "Preparar los elementos para Chia Pudding.",
      "Cocinar siguiendo la técnica de la cocina saludable.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo desayuno."
    ],
    "calorias": 431,
    "proteina": 22,
    "carbos": 75,
    "grasa": 7
  },
  {
    "id": 217,
    "nombre": "Té Matcha",
    "categoria": "rapido",
    "etiquetas": [
      "asiatica"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 45,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx2GKQ_1pBTuqg5PxxzZs1XZzxWTwFfdK-OQ&s",
    "descripcion": "Una delicia de la cocina asiatica, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Té Matcha.",
      "Cocinar siguiendo la técnica de la cocina asiatica.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 552,
    "proteina": 11,
    "carbos": 60,
    "grasa": 19
  },
  {
    "id": 218,
    "nombre": "Café Colombiano",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 42,
    "dificultad": "Media",
    "porciones": 1,
    "match": 0,
    "imagen": "https://colombia.co/sites/default/files/articles/semillas-y-taza-de-cafe-colombiano.webp",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Café Colombiano.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 600,
    "proteina": 24,
    "carbos": 30,
    "grasa": 23
  },
  {
    "id": 219,
    "nombre": "Mona de Pascua",
    "categoria": "rapido",
    "etiquetas": [
      "postres"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 47,
    "dificultad": "Media",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb1l9UNzsUZT1D2dw0r1LYHuOkT659JU-csw&s",
    "descripcion": "Una delicia de la cocina postres, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Mona de Pascua.",
      "Cocinar siguiendo la técnica de la cocina postres.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 423,
    "proteina": 17,
    "carbos": 32,
    "grasa": 22
  },
  {
    "id": 220,
    "nombre": "Pan de Jamón",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-frutos-secos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 59,
    "dificultad": "Difícil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMr6T1B30W938r8UhmlkXnktBVm_yst-Du-Q&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Pan de Jamón.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 504,
    "proteina": 29,
    "carbos": 62,
    "grasa": 10
  },
  {
    "id": 221,
    "nombre": "Hallacas",
    "categoria": "cena",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 55,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://i.ytimg.com/vi/qZtBvmaOGdA/maxresdefault.jpg",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Hallacas.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 350,
    "proteina": 27,
    "carbos": 55,
    "grasa": 22
  },
  {
    "id": 222,
    "nombre": "Arepa Cabimeras",
    "categoria": "cena",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 54,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScixZM-wnTtWVNBqf17MtT9zxrPBNa3GhWZw&s",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Arepa Cabimeras.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 597,
    "proteina": 40,
    "carbos": 44,
    "grasa": 27
  },
  {
    "id": 223,
    "nombre": "Patacón con Todo",
    "categoria": "cena",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 55,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://i.ytimg.com/vi/kWt22mQsQsg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCq4Cx_4EwlHYYfYHoDiF0V-RFgig",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para cena.",
    "pasos": [
      "Preparar los elementos para Patacón con Todo.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo cena."
    ],
    "calorias": 493,
    "proteina": 19,
    "carbos": 65,
    "grasa": 20
  },
  {
    "id": 224,
    "nombre": "Salchipapa Especial",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 34,
    "dificultad": "Fácil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://i.ytimg.com/vi/9YxJOHCYawQ/maxresdefault.jpg",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Salchipapa Especial.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 261,
    "proteina": 38,
    "carbos": 62,
    "grasa": 13
  },
  {
    "id": 225,
    "nombre": "Perro Caliente Callejero",
    "categoria": "rapido",
    "etiquetas": [
      "colombiana"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 22,
    "dificultad": "Media",
    "porciones": 2,
    "match": 0,
    "imagen": "https://ranchera.com.co/wp-content/uploads/2022/11/perro-colombiano-1.jpg",
    "descripcion": "Una delicia de la cocina colombiana, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Perro Caliente Callejero.",
      "Cocinar siguiendo la técnica de la cocina colombiana.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 222,
    "proteina": 25,
    "carbos": 31,
    "grasa": 19
  },
  {
    "id": 226,
    "nombre": "Hamburguesa Gourmet",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 30,
    "dificultad": "Difícil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Hamburguesa Gourmet.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 234,
    "proteina": 15,
    "carbos": 23,
    "grasa": 24
  },
  {
    "id": 227,
    "nombre": "Nuggets de Pollo Caseros",
    "categoria": "rapido",
    "etiquetas": [
      "rapida"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 33,
    "dificultad": "Difícil",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdxwkJysqK9z3iNFx9Ojw8klcYQBZtn1NyOw&s",
    "descripcion": "Una delicia de la cocina rapida, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Nuggets de Pollo Caseros.",
      "Cocinar siguiendo la técnica de la cocina rapida.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 543,
    "proteina": 19,
    "carbos": 58,
    "grasa": 27
  },
  {
    "id": 228,
    "nombre": "Alitas BBQ",
    "categoria": "rapido",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 39,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=80",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para Alitas BBQ.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 322,
    "proteina": 16,
    "carbos": 42,
    "grasa": 7
  },
  {
    "id": 229,
    "nombre": "Costillas de Cerdo",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 54,
    "dificultad": "Media",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWjpVzleJP1zjyCGwaep6TviYYMtl-ULYLlA&s",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Costillas de Cerdo.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 227,
    "proteina": 36,
    "carbos": 69,
    "grasa": 11
  },
  {
    "id": 230,
    "nombre": "Picaña a la Brasa",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 20,
    "dificultad": "Difícil",
    "porciones": 4,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzdeqWBhp_LKNlz9_qb2_kljgsjqBnsW88IA&s",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Picaña a la Brasa.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 328,
    "proteina": 37,
    "carbos": 70,
    "grasa": 8
  },
  {
    "id": 231,
    "nombre": "Parrillada Mixta",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 33,
    "dificultad": "Media",
    "porciones": 1,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwrHxYZfEV-iUnTKKWp0PQrqrR3n053Guk7A&s",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Parrillada Mixta.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 281,
    "proteina": 37,
    "carbos": 41,
    "grasa": 15
  },
  {
    "id": 232,
    "nombre": "Churrasco",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-mariscos"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 57,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://www.laylita.com/recetas/wp-content/uploads/2009/04/Bistec-de-carne-con-huevo-frito-o-churrasco-ecuatoriano.jpg",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Churrasco.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 386,
    "proteina": 38,
    "carbos": 43,
    "grasa": 15
  },
  {
    "id": 233,
    "nombre": "Vacio",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-frutos-secos",
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 25,
    "dificultad": "Fácil",
    "porciones": 2,
    "match": 0,
    "imagen": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Vacio.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 234,
    "proteina": 37,
    "carbos": 21,
    "grasa": 29
  },
  {
    "id": 234,
    "nombre": "Entraña",
    "categoria": "almuerzo",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 60,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_pCOWJQEw7lbou3rNZmaotSe6YWTnNLxjVw&s",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para almuerzo.",
    "pasos": [
      "Preparar los elementos para Entraña.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo almuerzo."
    ],
    "calorias": 580,
    "proteina": 35,
    "carbos": 47,
    "grasa": 23
  },
  {
    "id": 235,
    "nombre": " Choripán",
    "categoria": "rapido",
    "etiquetas": [
      "parrilla"
    ],
    "restricciones": [
      "sin-gluten",
      "sin-lactosa"
    ],
    "ingredientes": [
      "ingrediente 1",
      "ingrediente 2",
      "ingrediente 3",
      "ingrediente 4",
      "ingrediente 5"
    ],
    "tiempo": 32,
    "dificultad": "Fácil",
    "porciones": 3,
    "match": 0,
    "imagen": "https://www.laylita.com/recetas/wp-content/uploads/Receta-del-choripan.jpg",
    "descripcion": "Una delicia de la cocina parrilla, perfecta para rapido.",
    "pasos": [
      "Preparar los elementos para  Choripán.",
      "Cocinar siguiendo la técnica de la cocina parrilla.",
      "Ajustar sabores y servir caliente.",
      "Disfrutar de este plato tipo rapido."
    ],
    "calorias": 264,
    "proteina": 36,
    "carbos": 21,
    "grasa": 14
  }
];

function buscarPorIngredientes(ingredientesUsuario) {
  return RECETAS_DB.filter(r => r && r.nombre).map(receta => {
    const coincidencias = receta.ingredientes.filter(ing =>
      ingredientesUsuario.some(ui => ing.toLowerCase().includes(ui.toLowerCase()))
    ).length;
    const porcentaje = Math.round((coincidencias / receta.ingredientes.length) * 100);
    return { ...receta, match: porcentaje };
  }).filter(r => r.match > 30).sort((a, b) => b.match - a.match);
}
function filtrarPorCategoria(categoria) {
  return RECETAS_DB.filter(r => r && r.categoria === categoria);
}
function filtrarPorGustos(gustos) {
  if (!gustos || gustos.length === 0) return RECETAS_DB.filter(r => r && r.nombre);
  return RECETAS_DB.filter(r => r && r.etiquetas && r.etiquetas.some(tag =>
    gustos.includes(tag) || gustos.includes(tag.replace(/a$/, 'o'))
  ));
}
function filtrarPorRestricciones(restricciones) {
  if (!restricciones || restricciones.length === 0) return RECETAS_DB.filter(r => r && r.nombre);
  return RECETAS_DB.filter(receta => receta && restricciones.every(r =>
    receta.restricciones && receta.restricciones.includes(r)
  ));
}