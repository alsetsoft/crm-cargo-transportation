"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { useMemo } from "react";

import { LinkBehavior } from "@/components/crm/link-behavior";
import baseTheme from "@/lib/theme";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  // Layer the NextLink integration on top of the base theme HERE (in a
  // client-only module) so the "use client" LinkBehavior reference never
  // leaks into the shared lib/theme.ts. That module is imported from
  // Server Components for tokens like PRIMARY_CONTAINER_TINT; if it
  // imported LinkBehavior, the server-side client-reference stub would
  // be embedded in the theme and crash SSR.
  const theme = useMemo(
    () =>
      createTheme(baseTheme, {
        components: {
          MuiButtonBase: {
            defaultProps: {
              LinkComponent: LinkBehavior,
            },
          },
          MuiLink: {
            defaultProps: {
              component: LinkBehavior,
            },
          },
        },
      }),
    [],
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme={false} />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
