import React, { ReactNode } from 'react';

type PopUpProps = {
    heading?: string;
    description?: string;
    children: ReactNode;
    width?: string;
}

function PopUp ({ heading, description, children, width }: PopUpProps) {
    return (
        <div className={`font-header text-espresso bg-cream border-tawny-brown 
                        border-2 rounded-lg p-14 pt-10 pb-12 ${width}`}>
            {heading && <h2 className="font-bold text-3xl mb-1 text-center">{heading}</h2>}
            {description && <p className="mb-8 text-center">{description}</p>}
            <form className="flex flex-col gap-6">
                {children}
            </form>
        </div>
    );
}

export default PopUp;

