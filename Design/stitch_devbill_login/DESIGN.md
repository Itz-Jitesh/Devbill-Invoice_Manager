```markdown
# Design System Strategy: The Luminous Editorial

## 1. Overview & Creative North Star: "The Digital Curator"
This design system is not a utility; it is an environment. Our Creative North Star is **"The Digital Curator"**—a philosophy that treats every screen as a high-end editorial layout rather than a functional grid. We move beyond "SaaS-generic" by embracing intentional asymmetry, extreme breathing room, and the interplay of light through "glass" surfaces.

The goal is to evoke the feeling of a premium physical object—think of a matte-black architectural monograph. We break the "template" look by layering frosted elements over deep, expansive voids, allowing typography to command the space with authoritative scale.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the depth of a midnight sky (`surface: #0e1322`), using light not as a fill, but as a medium.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined through **Background Color Shifts**. To separate a sidebar from a main feed, transition from `surface` to `surface-container-low`. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the tiers to define importance:
*   **Base:** `surface` (#0e1322) - The infinite floor.
*   **Sections:** `surface-container-low` (#161b2b) - Subtle grouping.
*   **Interactive Cards:** `surface-container-highest` (#2f3445) - Elements that demand attention.
*   **Floating Modals:** Use Glassmorphism (see below).

### The "Glass & Gradient" Rule
To achieve "Apple-level" polish, floating elements (modals, dropdowns, navigation bars) must use the **Luminous Glass** effect:
*   **Fill:** `rgba(255, 255, 255, 0.06)`
*   **Blur:** `backdrop-filter: blur(20px)`
*   **Edge:** `1px solid rgba(255, 255, 255, 0.1)` (The "Ghost Border").

**Signature Textures:** For primary CTAs, use a linear gradient from `primary` (#c4c0ff) to `primary_container` (#8781ff) at a 135° angle. This adds "soul" and prevents the UI from feeling flat or clinical.

---

## 3. Typography: Editorial Authority
We pair the intellectual weight of **Noto Serif** with the precision of **Manrope** and **Inter**.

*   **Display & Headlines (Noto Serif):** Used for storytelling and page titles. High contrast in scale (e.g., `display-lg` at 3.5rem) creates an editorial, "curated" feel.
*   **Titles & Body (Manrope):** The workhorse. Manrope’s geometric warmth provides readability in complex data views.
*   **Labels (Inter):** Reserved for high-utility, small-scale data points (`label-sm`). Inter's tracking is superior for functional micro-copy.

**Hierarchy Note:** Use `on_surface_variant` (#c7c4d8) for secondary information to ensure the primary Noto Serif headings retain absolute dominance.

---

## 4. Elevation & Depth: Tonal Layering
We reject "drop shadows" in favor of **Tonal Stacking**.

*   **The Layering Principle:** Instead of shadows, place a `surface_container_lowest` (#090e1c) card onto a `surface_container` (#1a1f2f) background. The shift in value creates a natural, "recessed" or "lifted" feel.
*   **Ambient Glow:** For floating elements, use a diffused glow rather than a shadow. Use `surface_tint` at 8% opacity with a 40px blur. 
*   **Ghost Borders:** If a container requires a boundary (e.g., on top of a complex background), use `outline_variant` (#464555) at **20% opacity**. This provides a "suggestion" of a container without breaking the visual flow.

---

## 5. Components: The Primitive Set

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (1.5rem) roundedness. Text: `label-md` uppercase with 0.05em tracking.
*   **Secondary:** Glass fill (`rgba(255,255,255,0.06)`), Ghost Border.
*   **Tertiary:** No fill, `primary` (#c4c0ff) text, subtle underline on hover.

### Input Fields
*   **Base:** `surface_container_highest` fill, `xl` (1.5rem) corner radius.
*   **Focus:** Border shifts to `primary` (#c4c0ff) at 40% opacity; background shifts to `surface_bright`.
*   **Error:** Use `error` (#ffb4ab) for text and `error_container` as a 10% opacity background wash.

### Cards & Lists
*   **NO DIVIDERS:** Do not use lines to separate list items. Use **Spacing Scale 4 (1.4rem)** as a vertical gutter.
*   **Interactive Cards:** Use the `xl` (1.5rem) corner radius. On hover, the background should shift from `surface_container_low` to `surface_container_high`.

### Featured Component: The "Insight Rail"
A signature component for this system: A vertical, semi-transparent glass rail (`surface_container_lowest` at 60% opacity) that sits asymmetrically on the right side of the screen, housing high-level metrics in `display-sm` Noto Serif typography.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place a large `display-lg` heading on the left and leave 30% of the right-hand container as empty "negative" space.
*   **Embrace the Void:** Use `spacing-24` (8.5rem) between major sections to let the design breathe.
*   **Tint Your Blurs:** Ensure glass elements use the `surface` color as their base to maintain the deep navy "soul" of the system.

### Don't:
*   **No "Flat" Grays:** Never use `#333` or `#666`. Always use the palette's tinted neutrals (`outline`, `on_surface_variant`).
*   **No 100% Opaque Borders:** This shatters the "glass" illusion. If it’s a line, it must be transparent.
*   **No Over-Crowding:** If a screen feels busy, increase the spacing scale rather than adding dividers or borders.

---

## 7. Spacing & Geometry
*   **Standard Radius:** `xl` (1.5rem / 24px) for all primary containers and buttons.
*   **The "Apple" Margin:** Page margins should never be less than `spacing-10` (3.5rem) on mobile and `spacing-20` (7rem) on desktop. Space is the ultimate luxury.```