---
name: PitchRank AI
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#ecb2ff'
  on-secondary: '#520071'
  secondary-container: '#cf5cff'
  on-secondary-container: '#480063'
  tertiary: '#a8ffd2'
  on-tertiary: '#003824'
  tertiary-container: '#5be9ad'
  on-tertiary-container: '#006645'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#f8d8ff'
  secondary-fixed-dim: '#ecb2ff'
  on-secondary-fixed: '#320047'
  on-secondary-fixed-variant: '#74009f'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  max-width: 1440px
---

## Brand & Style

The design system establishes a "Command Center" aesthetic for high-stakes venture evaluation. It targets a sophisticated demographic of investors and founders who demand data density without sacrificing cinematic flair. The personality is authoritative, predictive, and high-performance.

The style is a hybrid of **Glassmorphism** and **High-Contrast Digital**. It leverages deep obsidian surfaces to create a sense of infinite space, punctuated by razor-sharp glowing elements that signify AI activity. The visual narrative mimics a premium terminal interface where every pixel feels intentional and every transition feels fluid yet instantaneous.

## Colors

The palette is anchored in **Zinc 950 (#09090B)** to provide a canvas of absolute depth. A subtle radial gradient of **Navy (#020617)** is applied to the background to prevent visual flatness and simulate a backlit display.

- **Electric Blue (#00E5FF):** Primary action color and AI "active" state.
- **Neon Purple (#BD00FF):** Secondary accent for premium features and high-growth indicators.
- **Emerald Green (#10B981):** Positive signals, data growth, and "Go" decisions.
- **Soft Pink (#FF4D94):** Highlight color for critical alerts or "Unicorn" potential status.

Gradients should be used sparingly for borders and subtle surface glints, primarily moving from Electric Blue to Neon Purple.

## Typography

This design system uses **Space Grotesk** for all display and heading roles to inject a technical, futuristic edge. Its geometric construction mirrors the "command center" theme. **Inter** is utilized for body copy and data labels to ensure maximum legibility and a systematic feel, reminiscent of high-end SaaS platforms.

Key principles:
- Use **Display LG** for hero impact and key scoring metrics.
- Use **Label SM** in all-caps with generous letter spacing for metadata and section headers.
- **Mono-data** style (Space Grotesk at smaller sizes) should be used for dynamic AI output strings and financial figures.

## Layout & Spacing

The layout follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. It uses an 8px rhythmic system, but allows for 4px increments in tight data visualizations to capture a "Bloomberg Terminal" density.

- **Margins:** Desktop utilizes wide 64px margins to allow the cinematic background gradients to breathe. Mobile tightens to 20px.
- **Sectioning:** Content is grouped into "Modules." Each module is separated by a 48px vertical gap on desktop.
- **Density:** High information density is encouraged within individual glass cards, while generous whitespace is maintained between primary layout blocks.

## Elevation & Depth

Depth is not communicated through shadows, but through **translucency and luminosity**. 

1.  **Base Layer:** The deepest Zinc/Navy background.
2.  **Mantle Layer:** Translucent dark glass (Opacity: 40%, Backdrop Blur: 20px) for sidebar and secondary navigation.
3.  **Card Layer:** Translucent glass (Opacity: 60%, Backdrop Blur: 40px) with a 1px inner border.
4.  **Floating Layer:** Tooltips and Modals. These feature a "glowing border" effect—a 1px gradient stroke (Electric Blue to Purple) that appears to emit light.

Use "Glints" (short, high-contrast linear gradients on top-left edges) to simulate light hitting the edge of glass panels.

## Shapes

The shape language is **"Technological Organic."** This design system uses `rounded-lg` (16px) for primary containers to soften the technical edge and provide a premium, modern feel. Smaller elements like buttons and chips use `rounded-md` (8px). 

Interactive elements should never be fully sharp (0px) or fully pill-shaped (except for status indicators), as the "Rounded" setting strikes the best balance between professional utility and futuristic aesthetics.

## Components

- **Glass Cards:** The fundamental container. Dark translucent fill, 1px subtle border (#FFFFFF10), and a 40px backdrop blur.
- **Action Buttons:** Primary buttons use a solid-to-transparent gradient fill (Electric Blue to Navy) with a high-intensity hover glow. Secondary buttons are "Ghost" style with a glowing 1px border.
- **AI Command Input:** A full-width text field with no background fill, only a bottom border that glows when focused. Use a blinking "block" cursor to mimic terminal inputs.
- **Metric Chips:** Small, high-contrast labels. For example, a "Unicorn Potential" chip should have a Soft Pink glow.
- **Data Grids:** Borderless rows separated by subtle 1px Zinc-800 lines. On hover, rows should highlight with a 5% white overlay and a subtle Electric Blue left-accent bar.
- **Evaluation Scoreboard:** Large-scale circular progress gauges or radial charts using the Electric Blue and Neon Purple gradients.