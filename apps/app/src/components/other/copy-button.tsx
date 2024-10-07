'use client';

import React, { forwardRef } from 'react';
import type { ButtonProps } from 'ui';
import { Button } from 'ui';

interface CopyButtonProps extends ButtonProps {
  text: string;
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const copy = async () => {
      await navigator.clipboard.writeText(props.text);
    };
    return (
      <Button
        {...props}
        className={className}
        onClick={copy}
        ref={ref}
        size={size}
        variant={variant}
      >
        {children}
      </Button>
    );
  },
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;
