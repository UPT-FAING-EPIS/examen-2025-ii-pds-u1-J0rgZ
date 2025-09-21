# Proyecto: Aplicación de Subasta en Línea

Una plataforma web completa desarrollada en .NET 6 y React que permite a los usuarios publicar artículos para subasta, realizar ofertas en tiempo real y gestionar todo el proceso de manera automatizada, desde la infraestructura hasta el despliegue final.

[![Despliegue de Infraestructura](https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/infra.yml/badge.svg)](https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/infra.yml)
[![Análisis con SonarCloud](https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/sonar.yml/badge.svg)](https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/sonar.yml)
[![Despliegue de Aplicación](https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/deploy_app.yml/badge.svg)](https://github.com/TU_USUARIO/TU_REPOSITORIO/actions/workflows/deploy_app.yml)
[![Último Release](https://img.shields.io/github/v/release/TU_USUARIO/TU_REPOSITORIO)](https://github.com/TU_USUARIO/TU_REPOSITORIO/releases)

---

## 🚀 Aplicación Desplegada (Demo en Vivo)

Puedes interactuar con la aplicación desplegada en Azure a través de la siguiente URL:

**[https://app-auction-frontend-xxxxxx.azurewebsites.net/](https://app-auction-frontend-xxxxxx.azurewebsites.net/)** *(Reemplaza esta URL con la tuya después del despliegue)*

---

## 🎯 Objetivo del Proyecto

El objetivo es desarrollar una plataforma web robusta que permita a los usuarios publicar artículos para subasta, realizar ofertas en tiempo real y gestionar el proceso de cierre y adjudicación. Este proyecto demuestra un ciclo de vida de desarrollo de software completo, aplicando principios de DevOps, Infraestructura como Código (IaC) y automatización de CI/CD.

## ✨ Funcionalidades Principales

-   **Publicación de Subastas:** Los usuarios pueden publicar artículos con imágenes, descripción, precio inicial y fecha/hora de cierre.
-   **Listado y Filtrado:** Visualización de subastas activas, próximas y finalizadas.
-   **Pujas en Tiempo Real:** Realización de ofertas que se actualizan instantáneamente para todos los usuarios conectados gracias a WebSockets (SignalR).
-   **Notificaciones Automáticas:** Alertas sobre nuevas ofertas, cierre de subastas y adjudicaciones.
-   **Panel de Usuario:** Un área personal para gestionar subastas, historiales de pujas y artículos ganados.

---

## 🏗️ Arquitectura y Diagramas

### Diagrama de Infraestructura en Azure

La infraestructura se gestiona completamente como código usando Terraform y se despliega automáticamente. El siguiente diagrama es generado por nuestro pipeline de CI/CD.

![Diagrama de Infraestructura](docs/diagram.png)

### Diagrama de Clases (Backend)

Un vistazo rápido a las entidades principales del sistema, generado automáticamente desde el código fuente.

![Diagrama de Clases](docs/class_diagram.png)

---

## 🛠️ Stack Tecnológico

| Área                  | Tecnología                                                              |
| --------------------- | ----------------------------------------------------------------------- |
| **Backend**           | .NET 6, ASP.NET Core Web API, SignalR (WebSockets), Entity Framework Core |
| **Frontend**          | React, Axios, Microsoft/SignalR Client                                  |
| **Base de Datos**     | In-Memory Database (para la demo)                                       |
| **Infraestructura**   | Azure (App Service, Service Plan), Terraform (IaC)                      |
| **CI/CD & DevOps**    | GitHub Actions, SonarCloud, Doxygen, PlantUML                           |
| **Pruebas**           | xUnit, Moq                                                              |

---

## 📂 Estructura del Repositorio

```
/
├── .github/
│   └── workflows/      # Pipelines de CI/CD
├── backend/
│   ├── src/            # Código fuente de la API .NET
│   └── tests/          # Pruebas unitarias
├── docs/               # Diagramas y documentación generada
├── frontend/           # Aplicación React
├── infrastructure/     # Scripts de Terraform (IaC)
└── README.md
```

---

## ⚙️ Cómo Ejecutar el Proyecto Localmente

### Prerrequisitos

-   .NET 6 SDK
-   Node.js v18+
-   Git

### Backend

```bash
# Navegar a la carpeta del backend
cd backend/src/AuctionApp.Api

# Instalar dependencias (se hace automáticamente con restore)
dotnet restore

# Ejecutar la aplicación
dotnet run
```
La API estará disponible en `https://localhost:7xxx` y `http://localhost:5xxx`.

### Frontend

```bash
# Navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar la aplicación de desarrollo
npm start
```
La aplicación se abrirá en `http://localhost:3000`.

---

## 🤖 Automatización y CI/CD (DevOps)

Este proyecto está configurado con un pipeline de CI/CD robusto utilizando GitHub Actions, cubriendo todos los aspectos del ciclo de vida del software.

1.  **`infra.yml` - Despliegue de Infraestructura:**
    -   **Disparador:** Push a `main` en la carpeta `infrastructure/`.
    -   **Acción:** Ejecuta `terraform apply` para crear o actualizar la infraestructura en Azure de forma automática y segura.

2.  **`sonar.yml` - Análisis de Calidad de Código:**
    -   **Disparador:** Push a `main` en la carpeta `backend/`.
    -   **Acción:** Compila el proyecto .NET, ejecuta las pruebas unitarias (generando reportes de cobertura) y envía los resultados a SonarCloud para un análisis estático de código, detectando bugs, vulnerabilidades y code smells.

3.  **`deploy_app.yml` - Despliegue de la Aplicación:**
    -   **Disparador:** Push a `main` en las carpetas `backend/` o `frontend/`.
    -   **Acción:** Compila y empaqueta el backend y el frontend, y los despliega en sus respectivos Azure App Services.

4.  **`generate_diagrams.yml` - Generación de Diagramas:**
    -   **Disparador:** Push a `main` en `infrastructure/` o en los modelos del `backend/`.
    -   **Acción:** Genera automáticamente el diagrama de infraestructura a partir del código de Terraform y el diagrama de clases a partir del código C#. Luego, los añade al repositorio en la carpeta `docs/`.

5.  **`release.yml` - Creación de Releases:**
    -   **Disparador:** Al crear un nuevo tag con el formato `v*.*.*` (ej. `v1.0.0`).
    -   **Acción:** Crea automáticamente un nuevo Release en GitHub, ideal para versionar el proyecto y llevar un control de cambios.

---

## ⚖️ Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.