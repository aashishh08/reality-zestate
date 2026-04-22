import Link from "next/link";
import type { ComponentProps } from "react";

export type NewTabLinkProps = ComponentProps<typeof Link>;

/** Internal links that should open in a new browser tab (category, project, blog routes only). */
export function NewTabLink({ target, rel, ...props }: NewTabLinkProps) {
  return (
    <Link
      {...props}
      target={target ?? "_blank"}
      rel={rel ?? "noopener noreferrer"}
    />
  );
}
