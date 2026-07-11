# Guía de Diseño para Figma

## Sistema de Diseño - Biblioteca Universitaria

### 1. Configuración del archivo en Figma

- Canvas: **1440x1024 px** (Desktop base)
- Crear páginas: `Login`, `Register`, `Dashboard`, `Books List`, `Book Form`, `Categories`, `Users`
- Crear componentes en una página separada `Design System`

---

### 2. Design System (Componentes raíz)

#### 2.1 Colores

| Token | Hex | Uso |
|---|---|---|
| `Primary` | `#4F46E5` | Botones principales, links, active sidebar |
| `Primary Hover` | `#4338CA` | Hover de botones primarios |
| `Primary Light` | `#EEF2FF` | Fondos de iconos en stat cards |
| `Secondary` | `#0EA5E9` | Gradiente auth background |
| `Success` | `#10B981` | Badge disponible, iconos success |
| `Warning` | `#F59E0B` | Iconos warning |
| `Danger` | `#EF4444` | Botón eliminar, badge no disponible |
| `Bg Primary` | `#FFFFFF` | Cards, sidebar header, body |
| `Bg Secondary` | `#F8FAFC` | Fondo página, thead |
| `Bg Tertiary` | `#F1F5F9` | Hover de tablas, secondary buttons |
| `Sidebar Bg` | `#1E293B` | Fondo del sidebar |
| `Text Primary` | `#0F172A` | Títulos, texto principal |
| `Text Secondary` | `#475569` | Texto secundario |
| `Text Tertiary` | `#94A3B8` | Placeholder, metadatos |
| `Border` | `#E2E8F0` | Bordes de tablas, inputs, cards |

#### 2.2 Tipografía

- **Font**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

| Style | Size | Weight | Line Height |
|---|---|---|---|
| `h1` (page header) | 24px | 700 | 32px |
| `h2` (section) | 20px | 600 | 28px |
| `h3` (card title) | 18px | 600 | 28px |
| `body` | 16px | 400 | 24px |
| `body-sm` | 14px | 400 | 20px |
| `caption` | 12px | 500 | 16px |
| `stat-number` | 30px | 700 | 36px |
| `btn-text` | 14px | 500 | 20px |

#### 2.3 Espaciado

| Token | px |
|---|---|
| `xs` | 4 |
| `sm` | 8 |
| `md` | 16 |
| `lg` | 24 |
| `xl` | 32 |
| `2xl` | 48 |
| `3xl` | 64 |

#### 2.4 Border Radius

| Token | px |
|---|---|
| `sm` | 4 |
| `md` | 8 |
| `lg` | 12 |
| `xl` | 16 |
| `full` | 9999 |

#### 2.5 Shadows

| Token | Value |
|---|---|
| `sm` | 0 1px 2px rgba(0,0,0,0.05) |
| `md` | 0 4px 6px -1px rgba(0,0,0,0.1) |
| `lg` | 0 10px 15px -3px rgba(0,0,0,0.1) |
| `xl` | 0 20px 25px -5px rgba(0,0,0,0.1) |

---

### 3. Layout General

#### 3.1 Desktop (>1024px)

```
┌──────────┬──────────────────────────────────────┐
│          │            HEADER                     │
│ SIDEBAR  │  height: 64px                         │
│ 260px    ├──────────────────────────────────────┤
│          │                                       │
│          │         PAGE CONTENT                  │
│          │    padding: 24px                      │
│          │    margin-top: 64px                   │
│          │                                       │
└──────────┴──────────────────────────────────────┘
```

#### 3.2 Tablet (768px)

- Sidebar colapsado a 72px con solo iconos
- O se oculta completamente con overlay toggle
- Header: left = 0
- Page content padding: 16px

#### 3.3 Mobile (<425px)

- Sidebar oculto, se abre con menú hamburguesa y overlay
- Header: solo logo + avatar (sin search bar)
- Cards en stack vertical 1 columna
- Tablas con scroll horizontal

---

### 4. Pantallas (Frames en Figma)

#### 4.1 Pantalla de Login (Frame: 1440x1024)

**Fondo**: Gradient `#4F46E5` → `#0EA5E9` (135deg)

**Card**: 420px de ancho, centrada vertical y horizontalmente
- Padding: 32px
- Border radius: 16px
- Shadow: xl

**Dentro del card**:
- Logo/Icon (opcional)
- H2: "Iniciar sesión" (center)
- Body-sm: "Ingresa tus credenciales para acceder al sistema" (center, #475569)
- Input: email (full width, 14px, padding 10px 14px, border #E2E8F0, border-radius 8px)
- Input: password (idem)
- Button primary: full width, 14px, padding 10px 20px, bg #4F46E5, border-radius 8px
- Link: "¿No tienes cuenta? Regístrate" (center, 14px)

#### 4.2 Pantalla de Register (Frame: 1440x1024)

Igual que Login con campos adicionales:
- Nombre completo
- Email
- Contraseña
- Confirmar contraseña

#### 4.3 Dashboard (Frame: 1440x1024)

**Page Header**:
- H1: "Dashboard"
- Body-sm: "Resumen del sistema de biblioteca"

**Stat Cards Grid** (5 cards, auto-fit min 240px):
Cada card:
- Width: flexible (mín 240px)
- Padding: 24px
- Border: 1px #E2E8F0
- Border-radius: 12px
- Shadow: sm
- Flex: icon (48x48, border-radius 8px) + text

Icon colors:
- 1st: bg #EEF2FF icon #4F46E5
- 2nd: bg #D1FAE5 icon #10B981
- 3rd: bg #FEE2E2 icon #EF4444
- 4th: bg #FEF3C7 icon #F59E0B
- 5th: bg #EEF2FF icon #4F46E5

#### 4.4 Lista de Libros (Frame: 1440x1024)

**Page Header**: "Libros" + button "Nuevo libro"

**Search Bar Card**:
- Input search (max-width 320px)
- Select categorías (max-width 200px)
- Background white, padding 24px, border-radius 12px

**Table**:
- Header bg: #F8FAFC
- Columns: Título, Autor, ISBN, Categoría, Disponibles, Estado, Acciones
- Estado badges:
  - "Disponible": bg #D1FAE5, text #065F46
  - "No disponible": bg #FEE2E2, text #991B1B
- Actions: buttons "Editar" (secondary) + "Eliminar" (danger)

**Pagination**:
- "Anterior" + "Página X de Y" + "Siguiente"

**Modal de confirmación** (al eliminar):
- Overlay: rgba(0,0,0,0.5)
- Card: 500px max-width, border-radius 16px, shadow xl
- Header: "Confirmar eliminación" + X close
- Body: "¿Estás seguro de eliminar este libro?"
- Footer: "Cancelar" (secondary) + "Eliminar" (danger)

#### 4.5 Formulario de Libro (Frame: 1440x1024)

**Card**: 720px max-width, padding 24px

**Form Row** (2 columns on desktop, 1 on mobile):
- Fila 1: Título | Autor
- Fila 2: ISBN | Categoría (select)
- Fila 3: Editorial | Año
- Fila 4: Cantidad | URL Imagen

**Checkbox**: "Libro disponible"

**Footer**: "Guardar" (primary) + "Cancelar" (secondary)

#### 4.6 Lista de Categorías (Frame: 1440x1024)

Misma estructura que Books pero columnas: Nombre, Descripción, Acciones

#### 4.7 Formulario de Categoría (Frame: 1440x1024)

**Card**: 500px max-width
- Nombre (input)
- Descripción (textarea)
- "Guardar" + "Cancelar"

#### 4.8 Lista de Usuarios (Frame: 1440x1024)

Misma estructura con columnas: Nombre, Email, Rol (badge), Registro (fecha)

---

### 5. Componentes Reutilizables (a crear en Figma)

1. **Button/Primary** - bg #4F46E5, text white, padding 10px 20px, radius 8px
2. **Button/Secondary** - bg #F1F5F9, text #0F172A, border #E2E8F0
3. **Button/Danger** - bg #EF4444, text white
4. **Button/Small** - padding 6px 12px, font 12px
5. **Input** - border #E2E8F0, padding 10px 14px, radius 8px, focus: border #4F46E5 + shadow #EEF2FF
6. **Select** - same as input
7. **Textarea** - same as input, min-height 100px
8. **Stat Card** - 240px min, padding 24px, radius 12px
9. **Table** - full width, header uppercase 12px #475569
10. **Badge/Success** - bg #D1FAE5, text #065F46, radius full
11. **Badge/Danger** - bg #FEE2E2, text #991B1B
12. **Modal** - 500px, overlay black 50%, radius 16px
13. **Sidebar Item** - padding 10px 12px, radius 8px, active: bg #4F46E5
14. **Header** - height 64px, border-bottom 1px #E2E8F0

---

### 6. Responsive Breakpoints

| Dispositivo | Width | Cambios |
|---|---|---|
| Mobile S | 320px | 1 columna, sidebar oculto, sin search |
| Mobile M | 375px | 1 columna |
| Mobile L | 425px | 1 columna, aparece search |
| Tablet | 768px | 2 columnas, sidebar colapsable |
| Laptop | 1024px | 3-4 columnas, sidebar completo |
| Desktop | 1440px | diseño completo |
