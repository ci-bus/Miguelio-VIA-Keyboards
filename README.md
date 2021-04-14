# Miguelio-VIA-Keyboards
VIA Software Open Source to keyboards with QMK

## Pre-requisitos
- [Git](https://git-scm.com/downloads)
- [Nodejs LTS](https://nodejs.org/en/)
  
### Software utilizado (caracter informativo)
- [Node HID](https://github.com/node-hid/node-hid)
> Con esta librería se hace la comunicación con el teclado, en el firmware de QMK el archivo que facilita esto es /quantum/via.c, el mismo utilizado por VIA.
- [Electron](https://www.electronjs.org/)
> Este framework permite compilar el proyecto como una aplicación de escritorio.
- [Angular](https://angular.io/) + [Material](https://material.angular.io/) + [ngrx](https://ngrx.io/) + [rxjs](https://rxjs.dev/)
> El front (la parte visual) esta desarrollada con Angula + material + ngrx + rxjs.

#### Recomendable para editar código
- [Visual Studio Code](https://code.visualstudio.com/download)

## ¿Como lo pruebo?

Clona el repositorio, puedes descargar los archivos en .zip y descomprimirlos o con Git instalado ejecutar desde un terminal o cmd:
```
git clone https://github.com/ci-bus/Miguelio-VIA-Keyboards.git
```

Ahora desde el terminal accede a la carpeta del proyecto con el comando cd y con node instalado ejecuta para instalar las librerias:
```
npm i
```

Ya estamos listos, para modificarlo no hace falta tener un teclado, se puede iniciar como una web con datos de pruebas, para ello ejecuta:
```
ng serve -o
```

Cuando quieras hacer pruebas reales con tu teclado ejecuta:
```
npm start:electron
```

## IMPORTANTE RECUERDA
Si haces una mejora debes compartirla para decidir si añadirla al proyecto.
Si se usa este software con fines comerciales es necesario añadir menciones a este proyecto.


## ¿Como puedes colaborar?
- Añadiendo mas traducciones, se requieren conocimientos de archivos JSON.
- Añadiendo mas layouts de teclados, se requiere conocimientos sobre configuración layouts de teclados con QMK y JSON.
- Añadiendo keys para funcionalidades que falten, se requiere experimentar para ver como se guarda esto en la memoria eeprom, conocimientos básicos sobre javascript, nodejs y estructura del proyecto.
- Implementado configuración de macros, se requieren altos conocimientos sobre javascript, Angular, ngrx, rxjs, nodejs, C, Arduino y QMK en general.
- Mejorando la documentación y la wiki.



