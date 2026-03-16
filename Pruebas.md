# Pruebas del Proyecto: Mi colección de juegos

## URL del proyecto
https://juegoscll.free.nf/?i=1

## Plan de pruebas
El objetivo de las pruebas es verificar que la aplicación web funcione
correctamente en sus principales funcionalidades. Para ello se probarán
las secciones más importantes del sistema como el formulario para agregar
videojuegos, la visualización de la lista de juegos, la conexión con la
base de datos y el uso de servicios externos como Google Maps.

Las pruebas consisten en ingresar diferentes datos en el formulario para
verificar que la información se guarde correctamente en la base de datos
y se muestre en la lista de videojuegos. También se verificará que el
servicio que devuelve datos en formato JSON funcione correctamente y que
el mapa de Google Maps muestre las tiendas de videojuegos cercanas.

## Criterios de aceptación
Los criterios de aceptación del sistema son los siguientes:

- El sitio web debe cargar correctamente en el navegador.
- El formulario debe permitir agregar videojuegos sin errores.
- Los datos ingresados deben guardarse correctamente en la base de datos.
- La lista de videojuegos debe mostrarse correctamente en la página.
- El servicio que devuelve datos en formato JSON debe funcionar correctamente.
- El mapa de Google Maps debe mostrarse correctamente y permitir visualizar
  tiendas de videojuegos cercanas.
- El sistema debe validar los datos del formulario y mostrar mensajes de
  error cuando los datos no sean correctos.

## Resultados obtenidos de las pruebas

## Prueba 1 – Evaluación del sitio con Lighthouse

**Objetivo:**  
Evaluar el rendimiento, accesibilidad, buenas prácticas y optimización SEO del sitio web.

**Herramienta utilizada:**  
Lighthouse integrado en el navegador Google Chrome.

**Procedimiento:**  
1. Se abrió el sitio web del proyecto en el navegador.
2. Se accedió a las herramientas de desarrollador con Ctrl + Shift + I.
3. Se seleccionó la pestaña Lighthouse.
4. Se ejecutó el análisis seleccionando las categorías Performance, Accessibility, Best Practices y SEO.

**Resultados obtenidos:**

- Performance: 80
- Accessibility: 88
- Best Practices: 100
- SEO: 90

**Interpretación de los resultados:**  
El sitio web presenta un buen desempeño general. El rendimiento es aceptable y las buenas prácticas obtuvieron una puntuación perfecta. La accesibilidad y el SEO también muestran buenos resultados, lo que indica que el sitio está optimizado y sigue recomendaciones adecuadas para el desarrollo web.

**Aprobada**

<img width="600" height="240" alt="image" src="https://github.com/user-attachments/assets/8e6af405-ad9a-41f2-8243-93d262ea234f" />


## Prueba 2 – Registro de videojuegos con formulario

**Objetivo:**  
Verificar que el formulario permita registrar videojuegos correctamente.

**Procedimiento:**  
1. Se accedió a la sección "Añadir Juego".
2. Se ingresaron datos de prueba en el formulario.
3. Se envió el formulario para registrar el videojuego.

Datos de prueba utilizados:

Nombre: Spiderman
Genero: Accion  
Año: 2018  
Plataforma: Ps4,Ps5,Pc

**Resultado esperado:**  
El sistema debe registrar el videojuego y mostrarlo en la lista de juegos.

**Resultado obtenido:**  
El sistema registró correctamente el videojuego y lo mostró en la lista de juegos almacenados.

**Resultado final:**  
Prueba aprobada.


## Prueba 3 – Verificación de almacenamiento en base de datos

**Objetivo:**  
Comprobar que los videojuegos registrados mediante el formulario se almacenen correctamente en la base de datos.

**Herramienta utilizada:**  
Lighthouse integrado en el navegador Google Chrome.

**Procedimiento:**  
1. Se accedió a la sección "Añadir Juego".
2. Se ingresaron datos de prueba en el formulario.
3. Se envió el formulario para registrar el videojuego.
4. Posteriormente se revisó la sección "Mis Juegos".

**Resultados obtenidos:**

- Performance: 96
- Accessibility: 88
- Best Practices: 100
- SEO: 90

Datos utilizados en la prueba:

Nombre: GTA V  
Genero: Acción  
Año: 2013  
Plataforma: Ps4,Ps5,Xbox,Pc

**Resultado esperado:**  
El videojuego registrado debe aparecer en la lista de juegos.

**Resultado obtenido:**  
El videojuego se registró correctamente y apareció en la lista de juegos del sistema.

**Resultado final:**  
Prueba aprobada.

<img width="600" height="240" alt="image" src="https://github.com/user-attachments/assets/12c0819a-4bdc-4d43-a646-9ba49370d8f2" />



