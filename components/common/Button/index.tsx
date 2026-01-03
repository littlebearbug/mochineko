import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'solid' | 'outline' | 'ghost';
type ButtonShape = 'rounded' | 'capsule';
type ButtonPadding = 'default' | 'none';
type ButtonMode = 'button' | 'text';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  padding?: ButtonPadding;
  mode?: ButtonMode;
}

const Button = ({
  children,
  className = '',
  variant = 'solid',
  shape = 'rounded',
  padding = 'default',
  mode = 'button',
  disabled,
  ...rest
}: ButtonProps) => {
  const baseStyles =
    'flex items-center justify-center transition-colors duration-200 border focus:outline-none disabled:cursor-not-allowed cursor-pointer';

  const shapeStyles = {
    rounded: 'rounded-md',
    capsule: 'rounded-full',
  };

  const paddingStyles = {
    default: 'px-4 py-2',
    none: 'px-0 py-0',
  };

  const enableHover = mode === 'button';

  const variantStyles = {
    solid: `
      bg-[#405dff] border-[#405dff] text-white
      ${enableHover ? 'hover:bg-[#3333cc] hover:border-[#3333cc]' : ''}
      disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500
    `,

    outline: `
      bg-transparent border-[#405dff] text-[#405dff]
      ${enableHover ? 'hover:text-[#3333cc] hover:border-[#3333cc]' : ''}
      disabled:border-gray-300 disabled:text-gray-400
    `,

    ghost: `
      bg-transparent border-transparent text-[#405dff]
      ${enableHover ? 'hover:text-[#3333cc] hover:bg-gray-50' : ''}
      disabled:text-gray-400 disabled:bg-transparent
    `,
  };

  const combinedClassName = twMerge(
    baseStyles,
    shapeStyles[shape],
    paddingStyles[padding],
    variantStyles[variant],
    className
  );

  return (
    <button className={combinedClassName} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
