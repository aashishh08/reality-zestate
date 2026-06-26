'use client';

import type { ComponentProps } from 'react';
import { trackWhatsAppClick } from '@/lib/analytics';

type TrackedWhatsAppLinkProps = ComponentProps<'a'> & {
  placement: string;
  context?: string;
};

export function TrackedWhatsAppLink({
  placement,
  context,
  onClick,
  children,
  ...props
}: TrackedWhatsAppLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackWhatsAppClick({ placement, context });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
