import { alpha, createTheme } from "@mui/material/styles";

// Side-effect import: registers MuiDataGrid in the MUI theme component map
// so `components.MuiDataGrid` below is typed correctly and picked up.
import type {} from "@mui/x-data-grid/themeAugmentation";

// ---------------------------------------------------------------------------
// Brand palette — derived from the M3 seed colour that matches the Tailwind
// design token `--sidebar-primary: oklch(0.53 0.13 201)` (≈ #1097B3 teal).
//
// M3 tonal palette roles are mapped to MUI palette keys so that every
// component can reference `theme.palette.*` without knowing hexes.
// ---------------------------------------------------------------------------

// Primary (Indigo / violet — matches the VlasnaCRM brand mock)
const PRIMARY_MAIN = "#6366F1"; // Indigo 500 (M3 primary)
const PRIMARY_LIGHT = "#A5A8F7"; // Indigo 300
const PRIMARY_DARK = "#4338CA"; // Indigo 700
const ON_PRIMARY = "#FFFFFF"; // On-primary (white)

// Pre-computed 12% primary tint for M3 "primary-container"-style icon
// surfaces. Exported as a plain string so Server Components can drop it
// into `sx` without crossing the RSC boundary with a function callback
// (React 19 / Next.js 16 forbids serialising functions across the boundary).
export const PRIMARY_CONTAINER_TINT = alpha(PRIMARY_MAIN, 0.12);

// Secondary (M3 secondary — analogous cool teal, lower chroma)
const SECONDARY_MAIN = "#4A6266"; // S-40
const SECONDARY_LIGHT = "#A4C9CE"; // S-80
const SECONDARY_DARK = "#294749"; // S-20

// Surface / background roles
const BACKGROUND_DEFAULT = "#F5FBFC"; // N-98  (neutral near-white with hint of primary)
const BACKGROUND_PAPER = "#FFFFFF"; // N-100 (pure white for cards/paper)

// Outline
const OUTLINE = "#6F797A"; // NV-50
const OUTLINE_VARIANT = "#BFC8CA"; // NV-80

// Text (on-surface roles)
const TEXT_PRIMARY = "#181C1D"; // N-10  (on-surface)
const TEXT_SECONDARY = "#3F484A"; // N-20  (on-surface-variant)

// Error (M3 error seed)
const ERROR_MAIN = "#BA1A1A"; // E-40
const ERROR_LIGHT = "#FF5449"; // E-60
const ERROR_DARK = "#8C0009"; // E-20

// Warning — amber
const WARNING_MAIN = "#B86800";
const WARNING_LIGHT = "#FFA000";
const WARNING_DARK = "#7A4500";

// Success — green
const SUCCESS_MAIN = "#1B6A3A";
const SUCCESS_LIGHT = "#43A367";
const SUCCESS_DARK = "#004822";

// Info — blue
const INFO_MAIN = "#1565C0";
const INFO_LIGHT = "#5E9FEF";
const INFO_DARK = "#003C8F";

// ---------------------------------------------------------------------------
// Theme definition
// ---------------------------------------------------------------------------
const theme = createTheme({
  // ---- Palette ---------------------------------------------------------------
  palette: {
    mode: "light",
    primary: {
      main: PRIMARY_MAIN,
      light: PRIMARY_LIGHT,
      dark: PRIMARY_DARK,
      contrastText: ON_PRIMARY,
    },
    secondary: {
      main: SECONDARY_MAIN,
      light: SECONDARY_LIGHT,
      dark: SECONDARY_DARK,
      contrastText: "#FFFFFF",
    },
    error: {
      main: ERROR_MAIN,
      light: ERROR_LIGHT,
      dark: ERROR_DARK,
      contrastText: "#FFFFFF",
    },
    warning: {
      main: WARNING_MAIN,
      light: WARNING_LIGHT,
      dark: WARNING_DARK,
      contrastText: "#FFFFFF",
    },
    success: {
      main: SUCCESS_MAIN,
      light: SUCCESS_LIGHT,
      dark: SUCCESS_DARK,
      contrastText: "#FFFFFF",
    },
    info: {
      main: INFO_MAIN,
      light: INFO_LIGHT,
      dark: INFO_DARK,
      contrastText: "#FFFFFF",
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled: OUTLINE,
    },
    divider: OUTLINE_VARIANT,
    // Expose surface-variant as action.selected so components that need
    // a subtle fill can reference it without custom keys.
    action: {
      selectedOpacity: 0.08,
      hoverOpacity: 0.08,
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  },

  // ---- Typography ------------------------------------------------------------
  // Inter is loaded in app/layout.tsx via next/font and exposed as
  // --font-inter CSS variable. The theme references the variable so the
  // font works on both server-rendered and client-hydrated passes.
  typography: {
    fontFamily:
      "var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
    // M3 Display — used for hero / marketing headings
    h1: { fontSize: "3.562rem", fontWeight: 400, lineHeight: 1.12, letterSpacing: "-0.025em" }, // Display Large
    h2: { fontSize: "2.812rem", fontWeight: 400, lineHeight: 1.16, letterSpacing: "-0.015em" }, // Display Medium
    h3: { fontSize: "2.25rem",  fontWeight: 400, lineHeight: 1.22, letterSpacing: "0"        }, // Display Small
    // M3 Headline — page / section titles
    h4: { fontSize: "2rem",    fontWeight: 400, lineHeight: 1.28, letterSpacing: "0"        }, // Headline Large
    h5: { fontSize: "1.75rem", fontWeight: 400, lineHeight: 1.32, letterSpacing: "0"        }, // Headline Medium
    h6: { fontSize: "1.5rem",  fontWeight: 400, lineHeight: 1.36, letterSpacing: "0"        }, // Headline Small
    // M3 Title — card / list titles
    subtitle1: { fontSize: "1rem",   fontWeight: 500, lineHeight: 1.5, letterSpacing: "0.015em" }, // Title Large
    subtitle2: { fontSize: "0.875rem",fontWeight: 500, lineHeight: 1.43,letterSpacing: "0.01em"  }, // Title Medium
    // M3 Body
    body1: { fontSize: "1rem",   fontWeight: 400, lineHeight: 1.5,  letterSpacing: "0.031em" }, // Body Large
    body2: { fontSize: "0.875rem",fontWeight: 400, lineHeight: 1.43, letterSpacing: "0.018em" }, // Body Medium
    // M3 Label
    caption: { fontSize: "0.75rem",  fontWeight: 400, lineHeight: 1.33, letterSpacing: "0.033em" }, // Label Small
    overline: { fontSize: "0.6875rem",fontWeight: 500, lineHeight: 1.45, letterSpacing: "0.063em", textTransform: "uppercase" }, // Label Extra Small
    button:  { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.43, letterSpacing: "0.006em" }, // Label Large (button label)
  },

  // ---- Shape -----------------------------------------------------------------
  // M3 corner radius buckets mapped to a single borderRadius base.
  // Components use multiples: shape.borderRadius (8px = M3 small/medium).
  // For chips/pills a value of 100 produces full rounding.
  shape: {
    borderRadius: 8, // M3 "small" token — default for most surfaces
  },

  // ---- Component defaults ----------------------------------------------------
  // Note: NextLink integration (registering LinkBehavior as the default
  // `LinkComponent` for ButtonBase and `component` for Link) is layered on
  // top of this base theme inside `app/providers.tsx` — keeping it there
  // avoids importing the "use client" LinkBehavior from this shared
  // module, which would crash SSR (the server-side stub is not renderable).
  components: {
    // Buttons: M3 buttons use sentence-case labels, no elevation by default
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 100, // M3 buttons are fully-rounded (stadium)
          fontWeight: 500,
          letterSpacing: "0.006em",
        },
        sizeLarge: {
          paddingTop: "10px",
          paddingBottom: "10px",
          fontSize: "0.9375rem",
        },
        sizeSmall: {
          paddingTop: "6px",
          paddingBottom: "6px",
        },
      },
    },

    // Text fields: outlined by default, small density to match existing UI
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8, // M3 "small" corner
        },
      },
    },

    // Cards: outlined variant (M3 "outlined card"), medium corner radius
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          borderRadius: 12, // M3 "medium" corner
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px",
          "&:last-child": { paddingBottom: "16px" },
        },
      },
    },

    // Paper: inherit card radius token
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12, // M3 "medium" corner
        },
      },
    },

    // Chip: M3 chips are stadium-shaped (full pill).
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          fontWeight: 500,
          fontSize: "0.8125rem",
        },
      },
    },

    // Alert: M3 "medium" corner to match cards
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    // Table cells: 12dp vertical / 12dp horizontal — on the 4dp grid.
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          padding: "12px",
        },
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        },
      },
    },

    // Disable ripple on CssBaseline so Tailwind's focus-visible rings still
    // work cleanly on non-MUI elements — keep the classes unaffected.
    MuiCssBaseline: {
      styleOverrides: {
        // Allow Tailwind's body gradient / background to coexist:
        // CssBaseline resets body, so we re-apply only what MUI needs
        // (box-sizing, font) and leave background alone (set by globals.css).
        body: {
          fontFamily:
            "var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },

    // AppBar default elevation 0 — we use outlined/surface style for the shell
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "default",
      },
    },

    // Primary container colour for tonal surfaces (M3)
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px 8px 0 0",
        },
      },
    },

    // DataGrid: rows auto-grow to fit content and cells have consistent
    // vertical padding so single-line and multi-line cells visually line
    // up across the row instead of one column appearing centered while
    // another (with two-line content) appears shifted.
    MuiDataGrid: {
      defaultProps: {
        getRowHeight: () => "auto",
      },
      styleOverrides: {
        root: {
          border: "none",
          // Vertical breathing room when rows auto-size. align-items:center
          // stays the default — the per-cell padding keeps the visual
          // centerline stable whether content is one line or several.
          "& .MuiDataGrid-cell": {
            paddingTop: 10,
            paddingBottom: 10,
            // The cell flex container is row-direction; ensure renderCell
            // content (whether a Stack or a single Typography) anchors at
            // the cell's vertical middle.
            alignItems: "center",
          },
          // Header row keeps fixed height — only data rows auto-size.
          "& .MuiDataGrid-columnHeader": {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
    },
  },
});

export default theme;
