import React from 'react'

type Props = {
  onClick?: () => void,
  classes: string,
  disabled?: boolean,
  type: 'submit' | 'reset' | 'button',
  buttonText: string,
  isLoading?: boolean
}

const Button = ({ onClick, classes, disabled, type, buttonText, isLoading }: Props) => {
  return (
    <button
    onClick={onClick || (() => {})}
    type={type}
    disabled={isLoading || disabled}
    className={`${classes} ${
      isLoading ? 'cursor-not-allowed bg-blue-300' : ''
    }`}
  >{isLoading ? 'Loading...' : buttonText}
    </button>
  )
}

export default Button