# OptQuest para Arena

Presentación web estática de 8 láminas, centrada exclusivamente en explicar la herramienta OptQuest para Arena: definición, arquitectura, formulación, ciclo de búsqueda, funcionamiento interno, configuración, interpretación y buenas prácticas.

## Abrir en local

No requiere instalación ni compilación. Puedes abrir `index.html` directamente o iniciar un servidor local:

```powershell
python -m http.server 8080
```

Luego abre `http://localhost:8080`.

## Controles

- Flechas izquierda/derecha o espacio: navegar.
- `O`: abrir el índice.
- `F`: pantalla completa.
- `?`: ver atajos.

## Publicar con GitHub Pages

1. Sube el contenido de esta carpeta a la raíz de un repositorio.
2. En GitHub, abre **Settings → Pages**.
3. Selecciona **Deploy from a branch**, la rama principal y la carpeta `/ (root)`.

La presentación funciona sin dependencias externas. La carpeta `assets` incluye el isotipo de la Universidad de Lima y las capturas originales de OptQuest utilizadas para explicar límites y objetivos.
