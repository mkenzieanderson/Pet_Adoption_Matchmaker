import React, { ReactNode } from 'react';

type FormProps = {
    title?: string;
    description?: string;
    children: ReactNode;
    width?: string;
}

function Form ({ title, description, children, width }: FormProps) {
    return (
        <div className={`font-header text-espresso bg-cream border-tawny-brown 
                        border-2 rounded-lg p-14 pt-10 pb-12 ${width}`}>

            {title && <h2 className="font-bold text-3xl mb-1 text-center">{title}</h2>}
            {description && <p className="mb-8 text-center">{description}</p>}

            <form className="flex flex-col gap-6">
                {children}
            </form>
        </div>
    );
}

export default Form;