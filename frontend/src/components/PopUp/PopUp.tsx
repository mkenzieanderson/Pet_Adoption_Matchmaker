import { ReactNode } from 'react';

type PopUpProps = {
    header?: string;
    description?: string;
    children: ReactNode;
    width?: string;
}

function PopUp ({ header, description, children, width }: PopUpProps) {
    return (
        <div className={`font-header text-espresso bg-cream border-tawny-brown 
                        border-4 rounded-lg p-14 pt-10 pb-12 ${width} z-50 shadow-2xl`}>
            {header && <h2 className="font-bold text-3xl mb-2 text-center">{header}</h2>}
            {description && <p className="mb-8 text-center">{description}</p>}
            <form className="flex flex-col gap-6">
                {children}
            </form>
        </div>
    );
}

export default PopUp;

