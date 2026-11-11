import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-ink shadow-[0_14px_30px_-16px_rgb(var(--accent)/0.8)] hover:-translate-y-0.5 hover:bg-accent/90',
        secondary: 'bg-ink text-canvas hover:-translate-y-0.5 hover:bg-ink/90',
        outline:
          'border border-line bg-transparent text-ink hover:border-ink/35 hover:bg-elevated/70',
        ghost: 'text-ink hover:bg-elevated',
        soft: 'bg-accent-soft text-accent hover:bg-accent-soft/75',
        danger: 'bg-rose-600 text-white hover:bg-rose-700',
        light: 'bg-[#fdfaf4] text-[#181613] hover:-translate-y-0.5 hover:bg-white',
        glass:
          'border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20',
      },
      size: {
        sm: 'h-9 px-4 text-[0.8rem]',
        md: 'h-11 px-5 text-[0.86rem]',
        lg: 'h-[3.15rem] px-7 text-[0.95rem]',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, disabled, children, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
