"use client";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { LogOut, UserRound } from "lucide-react";
import { useRef, useState, useTransition } from "react";

import { signOutAction } from "@/actions/auth";

type UserMenuProps = {
  email: string;
  fullName: string | null;
  role: string;
};

export function UserMenu({ email, fullName, role }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const open = Boolean(anchorEl);
  const displayName = fullName?.trim() || email;
  const initial = (displayName.match(/[\p{L}\p{N}]/u)?.[0] ?? "?").toUpperCase();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSignOut = () => {
    handleClose();
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <>
      <IconButton
        ref={buttonRef}
        onClick={handleOpen}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-label="меню користувача"
        sx={{ p: 1 }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 32,
            height: 32,
            fontSize: "0.8125rem",
            fontWeight: 600,
          }}
        >
          {initial}
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 2,
            sx: { mt: 0.5, minWidth: 224 },
          },
        }}
      >
        {/* User info header — disabled, no hover */}
        <MenuItem
          disabled
          disableRipple
          sx={{
            "&.Mui-disabled": { opacity: 1 },
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0.25,
            py: 1.5,
            cursor: "default",
          }}
        >
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontWeight: 600, color: "text.primary", maxWidth: 192 }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{ color: "text.secondary", maxWidth: 192, display: "block" }}
          >
            {email}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            <UserRound size={12} />
            {role}
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={onSignOut}
          disabled={isPending}
          sx={{ gap: 1.5, color: "error.main" }}
        >
          <LogOut size={16} />
          <Typography variant="body2">
            {isPending ? "Вихід..." : "Вийти"}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
