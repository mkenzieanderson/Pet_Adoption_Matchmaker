import  { MouseEvent, ElementType } from 'react';
import { defaultButtonStyle } from './ButtonStyles.tsx'

type ButtonProps = {
    text?: string;
    className?: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    svgIcon?: ElementType;
    svgClassName?: string;
}

function Button (props: ButtonProps) {
    return (
        <button 
            className={ props.className ? props.className : defaultButtonStyle }
            onClick={(e) => {
                e.preventDefault();
                props.onClick(e);
            }}
        >
        {props.svgIcon ? (
            <props.svgIcon className={props.svgClassName ? `${props.svgClassName}` : `text-4xl` }/>
        ) : (
            props.text
        )}
        </button>
    );
}


export default Button;
