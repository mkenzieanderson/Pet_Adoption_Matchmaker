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
                        border-2 rounded-lg p-12 pt-10 pb-12 ${width}`}>
            {title && <h2 className="font-bold text-3xl mb-1">{title}</h2>}
            {description && <p className="mb-8">{description}</p>}

            <form className="flex flex-col gap-4 items-start">
                {children}
            </form>
        </div>
    );
}

export default Form;