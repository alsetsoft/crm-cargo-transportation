"use client";

import { LogOut, UserRound } from "lucide-react";
import { useTransition } from "react";

import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  email: string;
  fullName: string | null;
  role: string;
};

export function UserMenu({ email, fullName, role }: UserMenuProps) {
  const [isPending, startTransition] = useTransition();

  const onSignOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  const displayName = fullName?.trim() || email;
  const initials = (displayName.match(/[\p{L}\p{N}]/u)?.[0] ?? "?").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-md pr-3 pl-2"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {initials}
          </span>
          <span className="hidden text-sm sm:inline">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-medium">{displayName}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <UserRound className="size-3" /> {role}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onSignOut();
          }}
          disabled={isPending}
        >
          <LogOut className="size-4" />
          <span>{isPending ? "Вихід..." : "Вийти"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
