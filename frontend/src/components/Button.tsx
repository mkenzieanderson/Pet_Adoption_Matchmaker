import  { MouseEvent } from 'react';

const defaultButtonStyle = `bg-mustard text-espresso font-header 
                            font-semibold border-tawny-brown border-4
                            rounded-lg px-6 py-2 mt-4 mb-2 w-auto
                            hover:border-espresso hover:bg-transparent-clay
                            focus:border-espresso focus:bg-transparent-clay
                            focus:outline-espresso`

const errorButtonStyle =    `bg-light-rose text-dark-cherry font-header 
                            font-semibold border-dark-cherry border-4
                            rounded-lg px-6 py-2 mt-4 mb-2 w-auto
                            hover:border-dark-cherry hover:bg-dark-rose
                            focus:border-dark-cherry focus:bg-dark-rose
                            focus:outline-dark-cherry`

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
