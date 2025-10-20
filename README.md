# GO Online - Juego de Go con IA

Una aplicación moderna de Go (juego de estrategia milenario) con oponente de IA avanzada usando Claude AI.

## Características

- **Juego de Go Completo**: Implementación auténtica de las reglas del Go en tablero 9x9
- **IA Avanzada**: Oponente inteligente powered by Claude AI de Anthropic
- **UI/UX Moderna**: Diseño atractivo con animaciones fluidas usando Framer Motion
- **Contador en Tiempo Real**: Estadísticas de partidas y jugadores
- **Seguridad**: Variables de entorno para proteger API keys

## Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos
- **Framer Motion** - Animaciones fluidas
- **Anthropic Claude API** - Inteligencia Artificial
- **Vercel** - Deployment

## Instalación Local

1. Clona el repositorio:
```bash
git clone https://github.com/mitre88/go_on_line.git
cd go_on_line
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tu API key de Anthropic:
```
ANTHROPIC_API_KEY=tu_api_key_aqui
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Deployment en Vercel

### Opción 1: Deploy desde GitHub

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Configura la variable de entorno `ANTHROPIC_API_KEY` en Vercel:
   - Settings → Environment Variables
   - Agrega: `ANTHROPIC_API_KEY` = tu_api_key
5. Deploy!

### Opción 2: Deploy desde CLI

```bash
npm install -g vercel
vercel
```

## Configuración de Variables de Entorno en Vercel

**IMPORTANTE**: Nunca subas tu archivo `.env.local` a Git. Las API keys deben configurarse en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega: `ANTHROPIC_API_KEY` con tu API key
4. Aplica a: Production, Preview, Development

## Reglas del Juego

### Objetivo
Controlar más territorio que tu oponente al final del juego.

### Cómo Jugar
1. Los jugadores se turnan colocando piedras en las intersecciones del tablero
2. Las piedras se capturan rodeándolas completamente
3. No puedes colocar una piedra en una posición sin libertades (suicidio)
4. La regla de Ko previene la repetición inmediata de posiciones
5. Pasa tu turno si no tienes movimientos válidos
6. El juego termina cuando ambos jugadores pasan consecutivamente

### Puntuación
- Cada piedra en el tablero = 1 punto
- Cada piedra capturada suma al oponente
- Territorio controlado suma puntos adicionales

## Estructura del Proyecto

```
go_para_web/
├── app/
│   ├── api/
│   │   ├── ai-move/         # Endpoint para movimientos de IA
│   │   └── stats/           # Endpoint para estadísticas
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página principal
│   └── globals.css          # Estilos globales
├── components/
│   ├── GoBoard.tsx          # Componente del tablero
│   ├── GameInfo.tsx         # Información del juego
│   └── WelcomeScreen.tsx    # Pantalla de bienvenida
├── lib/
│   └── goGame.ts            # Lógica del juego de Go
└── data/
    └── stats.json           # Estadísticas (generado automáticamente)
```

## Seguridad

- ✅ API keys en variables de entorno
- ✅ `.env.local` en `.gitignore`
- ✅ Variables de entorno no expuestas al cliente
- ✅ API routes server-side only
- ✅ Validación de movimientos

## Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## Créditos

Desarrollado por **[Nex-Tech-IA](https://nex-tech-ia.replit.app/)**

Powered by Claude AI de Anthropic

## Licencia

MIT License - Ver LICENSE para más detalles

## Soporte

Para reportar bugs o sugerir mejoras, abre un issue en GitHub.

---

¡Disfruta jugando al Go! 囲
