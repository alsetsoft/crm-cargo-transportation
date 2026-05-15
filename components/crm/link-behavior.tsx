"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { forwardRef } from "react";

// Forwarded-ref wrapper around next/link that is registered as the default
// `LinkComponent` for MUI ButtonBase and the default `component` for MUI Link
// (see lib/theme.ts). This lets Server Components write `<Button href="/x">`
// without passing `component={NextLink}` — passing a function as a prop
// across the RSC boundary is forbidden in React 19 / Next.js 16.
//
// MUI passes `href` plus anchor attributes (className, role, etc.). We split
// off the next/link-specific props and hand them to NextLink; everything else
// (className, children, aria-*, onClick, …) lands on the rendered anchor.
type LinkBehaviorProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: NextLinkProps["href"];
  prefetch?: NextLinkProps["prefetch"];
  replace?: NextLinkProps["replace"];
  scroll?: NextLinkProps["scroll"];
};

export const LinkBehavior = forwardRef<HTMLAnchorElement, LinkBehaviorProps>(
  function LinkBehavior(props, ref) {
    const { href, prefetch, replace, scroll, ...other } = props;
    return (
      <NextLink
        ref={ref}
        href={href}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        {...other}
      />
    );
  },
);
