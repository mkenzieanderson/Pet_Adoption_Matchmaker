import React, { ReactNode } from 'react';

type FormProps = {
    title?: string;
    description?: string;
    error_msg?: string;
    children: ReactNode;
    width?: string;
}

function Form ({ title, description, error_msg, children, width }: FormProps) {
    return (
        <div className={`font-header text-espresso bg-cream border-tawny-brown 
                        border-2 rounded-lg p-14 pt-10 pb-12 ${width}`}>
            {title && <h2 className="font-bold text-3xl mb-1 text-center">{title}</h2>}
            {description && <p className="mb-8 text-center">{description}</p>}
            {error_msg && <p className="text-red-600 mb-4 italic">{error_msg}</p>}

            <form className="flex flex-col gap-6">
                {children}
            </form>
        </div>
    );
}

export default Form;