import  { MouseEvent } from 'react';
import { defaultButtonStyle, errorButtonStyle } from '../styles/ButtonStyles.tsx'


type ButtonProps = {
    text: string;
    className?: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

function Button (props: ButtonProps) {
    return (
        <button 
            className={ props.className ? props.className : defaultButtonStyle }
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
}

export default Button;
