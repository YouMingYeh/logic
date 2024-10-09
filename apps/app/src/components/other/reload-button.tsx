'use client';

import React, { forwardRef } from 'react';
import type { ButtonProps } from 'ui';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'ui';

interface ReloadButtonProps extends ButtonProps {
  reload: () => void;
}

const ReloadButton = forwardRef<HTMLButtonElement, ReloadButtonProps>(
  ({ className, variant, size, children, reload, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Button
            {...props}
            className={className}
            onClick={reload}
            ref={ref}
            size={size}
            variant={variant}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Try again</TooltipContent>
      </Tooltip>
    );
  },
);

ReloadButton.displayName = 'ReloadButton';

export default ReloadButton;
