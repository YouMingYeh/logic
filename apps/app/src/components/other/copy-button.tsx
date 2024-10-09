'use client';

import React, { forwardRef } from 'react';
import type { ButtonProps } from 'ui';
import { Button, Tooltip, TooltipContent, TooltipTrigger, useToast } from 'ui';

interface CopyButtonProps extends ButtonProps {
  text: string;
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const { toast } = useToast();
    const copy = async () => {
      await navigator.clipboard.writeText(props.text);
      toast({
        title: 'Copied to clipboard',
      });
    };
    return (
      <Tooltip>
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent>Copy to clipboard</TooltipContent>
      </Tooltip>
    );
  },
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;
