import  { MouseEvent, ElementType } from 'react';

type ButtonProps = {
    text?: string;
    className?: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    svgIcon?: ElementType;
}

function Button (props: ButtonProps) {
    return (
        <button 
            className={
                props.className 
                ? props.className 
                : `bg-mustard text-espresso font-header 
                  font-semibold border-tawny-brown border-4
                  rounded-lg px-6 py-2 hover:border-espresso
                  mt-4 mb-2 w-auto hover:bg-transparent-clay`
            }
            onClick={props.onClick}
        >
        {props.svgIcon ? (
            <props.svgIcon className="text-4xl"/>
        ) : (
            props.text
        )}
        </button>
    );
}


export default Button;
