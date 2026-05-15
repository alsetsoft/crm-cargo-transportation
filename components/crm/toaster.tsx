"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { subscribe, type ToastMessage } from "@/lib/toast";

export function Toaster() {
  const [queue, setQueue] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return subscribe((msg) => {
      setQueue((prev) => [...prev, msg]);
    });
  }, []);

  const msg = queue[0] ?? null;

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setQueue((q) => q.slice(1));
  };

  return (
    <Snackbar
      open={queue.length > 0}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleClose}
      key={msg?.id ?? "empty"}
    >
      {msg ? (
        // M3 snackbars use a single inverse-surface container regardless of
        // severity; the leading icon carries the semantic colour. We keep
        // MUI Alert for its accessibility wiring (role="alert"/"status",
        // close button) but override the colour roles.
        <Alert
          severity={msg.severity}
          variant="filled"
          onClose={(e) => handleClose(e)}
          closeText="Закрити"
          sx={{
            width: "100%",
            minWidth: 280,
            bgcolor: "text.primary",
            color: "background.default",
            "& .MuiAlert-action .MuiIconButton-root": {
              color: "background.default",
            },
          }}
        >
          {msg.text}
        </Alert>
      ) : (
        <Alert severity="info" variant="filled" sx={{ display: "none" }}>
          &nbsp;
        </Alert>
      )}
    </Snackbar>
  );
}
