"use client";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { alpha, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import { Lock, MapPin, Settings } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LinkBehavior } from "@/components/crm/link-behavior";
import { navigationItems } from "@/components/crm/nav-config";
import { UserMenu } from "@/components/crm/user-menu";
import type { SessionUser } from "@/lib/auth";

export const DRAWER_WIDTH = 280;

// "Coming soon" items rendered in a disabled SKORO section. Not in
// nav-config because they have no route and are decorative only.
const COMING_SOON_ITEMS = [
  { title: "GPS трекінг", stage: "Етап 2", icon: MapPin },
  { title: "Налаштування", stage: "Етап 3", icon: Settings },
] as const;

type AppShellProps = {
  user: SessionUser;
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Derive the current page title from the navigation items
  const currentItem =
    [...navigationItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) =>
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
      ) ?? navigationItems[0];

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      {/* Brand block — same MUI Toolbar the AppBar uses (identical
          height calc). The divider line lives in a SIBLING <Divider />
          below, so the brand Toolbar is exactly Toolbar(64px) and the
          divider adds 1px = 65px total, matching AppBar's outer height
          (Toolbar 64 + AppBar's own outlined border 1). Putting the
          border inside this box would shrink the inner content area
          and leave a 1px gap. */}
      <NextLink
        href="/"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            color: "text.primary",
            flexShrink: 0,
            "&:hover": { bgcolor: "action.hover" },
            transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              width: 40,
              height: 40,
              borderRadius: 2,
              flexShrink: 0,
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            VC
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 700, lineHeight: 1.2 }}
            >
              VlasnaCRM
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block" }}
            >
              Облік перевезень
            </Typography>
          </Box>
        </Toolbar>
      </NextLink>
      <Divider />

      {/* Primary nav */}
      <List sx={{ px: 1.5, py: 1.5, flexShrink: 0 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <ListItemButton
              key={item.href}
              component={LinkBehavior}
              href={item.href}
              selected={isActive}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 999,
                px: 2,
                py: 1.25,
                mb: 0.5,
                color: "text.primary",
                "&.Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.18),
                  },
                },
                "&:not(.Mui-selected):hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: isActive ? "primary.main" : "text.secondary",
                }}
              >
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Coming soon */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Box
          sx={{
            px: 3,
            pt: 2,
            pb: 1,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: "0.1em", fontWeight: 600 }}
          >
            Скоро
          </Typography>
        </Box>
        <List sx={{ px: 1.5, py: 0 }}>
          {COMING_SOON_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <ListItemButton
                key={item.title}
                disabled
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.25,
                  mb: 0.25,
                  opacity: "1 !important",
                  cursor: "default",
                  "&.Mui-disabled": { opacity: 1 },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "text.disabled" }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.stage}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                    color: "text.disabled",
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                    color: "text.disabled",
                  }}
                />
                <Lock size={14} color={theme.palette.text.disabled} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        variant="outlined"
        sx={(theme) => ({
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
        })}
      >
        <Toolbar sx={{ gap: 1 }}>
          {!isDesktop && (
            <IconButton
              edge="start"
              aria-label="відкрити меню"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 0.5, p: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", lineHeight: 1.2 }}
            >
              CRM · Вантажні перевезення
            </Typography>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ fontWeight: 600 }}
            >
              {currentItem.title}
            </Typography>
          </Box>

          <UserMenu
            email={user.email}
            fullName={user.full_name}
            role={user.role}
          />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          slotProps={{
            paper: { "aria-label": "Навігаційне меню" },
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
        }}
      >
        <Toolbar />
        <Box
          sx={{
            px: { xs: 2, sm: 3, lg: 4 },
            py: { xs: 2, sm: 3 },
            mx: "auto",
            maxWidth: 1600,
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
