# miguelio-via
VIA Software Open Source to keyboards with QMK

## Pre-requisitos
- [Git](https://git-scm.com/downloads)
- [NodeJs LTS](https://nodejs.org/en/)

**Muy importante** en los ultimos pasos de la instalación de Node marca el check para instalar las tools necesarias de manera automática
![Marcar check en la instalación](https://github.com/ci-bus/miguelio-via/blob/master/src/assets/Captura.PNG?raw=true)
- (Windows) [PowerShell](https://answers.microsoft.com/es-es/windows/forum/windows_10-windows_install-winpc/c%C3%B3mo-instalar-powershell-en-windows-10/eafc6661-a558-4309-a7b1-5f6fa5ecb750)

  
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

Clona el repositorio, se recomienda hacer uso de git aunque también puedes descargar los archivo en .zip y descomprimirlos
```
git clone https://github.com/ci-bus/miguelio-via.git
```

Entra en la carpeta descargada con el comando cd y la ruta a la carpeta:
```
cd miguelio-via
```

Con node instalado ejecuta para instalar las librerias:
```
npm i
```

Si no tienes instalado Angular CLI te recomiendo instalarlo de manera global (esto necesita permisos de administrador o super usuario):
```
npm i -g @angular/cli
```

Si en windows te sale un error diciendo que la ejecución de scripts está desactivada ejecuta desde PowerShell abierto como administrador:
```
Set-ExecutionPolicy Unrestricted
```
Cuando te pregunte escribe una O "si a todo" y pulsa enter, esto solucionará el problema


Ya estamos listos, para modificarlo no hace falta tener un teclado, se puede iniciar como una web con datos de pruebas, para ello ejecuta:
```
npm run start:front
```

Cuando quieras hacer pruebas reales con tu teclado ejecuta:
```
npm run start:electron
```

## IMPORTANTE RECUERDA
Si haces una mejora debes compartirla para decidir si añadirla al proyecto.
Si se usa este software con fines comerciales es necesario añadir menciones a este proyecto.


## ¿Como puedes colaborar?
- Añadiendo mas traducciones, se requieren conocimientos de archivos JSON.
- Añadiendo mas layouts de teclados, se requiere conocimientos sobre configuración layouts de teclados con QMK y JSON.
- Añadiendo keys para funcionalidades que falten, se requiere experimentar para ver como se guarda esto en la memoria eeprom, conocimientos básicos sobre javascript, nodejs y estructura del proyecto.
- Implementando la configuración de macros, se requieren altos conocimientos sobre javascript, Angular, ngrx, rxjs, nodejs, C, Arduino y QMK en general.
- Mejorando la documentación y la wiki.



