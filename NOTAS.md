# Reflexión final

## 1. ¿Qué parte del proyecto te resultó más difícil y por qué?

La parte más difícil del proyecto fue integrar todas las partes anteriores en una API completa y coherente porque a hay bastante lío de archivos.

## 2. ¿Qué cambiarías si tuvieras que hacer este proyecto de nuevo desde cero?

Si tuviera que hacer el proyecto desde cero, empezaría definiendo primero el schema de Prisma y aplicando las migraciones antes de escribir todos los controladores, también organizaría el trabajo por bloques más pequeños.

## 3. ¿Cómo escalarías esta API si necesitase soportar 10.000 usuarios concurrentes?

Añadiendo índices.

Usar caché para endpoints de lectura frecuente.

## 4. ¿Qué ventaja real te ha dado TDD en este proyecto? ¿Hubo algún caso donde el test te hizo detectar un bug antes de probarlo manualmente?

Los tests dieron me más seguridad para modificar el proyecto sin tener que probar manualmente todos los endpoints cada vez.