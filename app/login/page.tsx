import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CarFront } from "lucide-react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { LoginForm } from "./_components/login-form";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ redirectTo }, user] = await Promise.all([
    searchParams,
    getCurrentUser(),
  ]);

  if (user) {
    redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/");
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* Logo + branding block */}
        <Stack alignItems="center" spacing={1.5} sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CarFront size={24} />
          </Box>
          <Box>
            <Typography variant="h6" component="h1" fontWeight={600}>
              Вантажні перевезення
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Операційна CRM
            </Typography>
          </Box>
        </Stack>

        {/* Login form */}
        <LoginForm redirectTo={redirectTo} />
      </Stack>
    </Container>
  );
}
