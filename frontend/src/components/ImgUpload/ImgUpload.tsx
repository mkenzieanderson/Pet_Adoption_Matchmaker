import { useState, useRef } from 'react';
import UploadIcon from "../../assets/upload_icon.png";


function ImgUpload () {
    const [imageURL, setImageURL] = useState<string | null>(null)
    const imgUploadRef = useRef<HTMLInputElement>(null);

    const handleImgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const imgFile = event.target.files?.[0];
        if (imgFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageURL(reader.result as string);
            }
            reader.readAsDataURL(imgFile)
        }
    };

    const handleClick = () => {
        imgUploadRef.current?.click();
    }

    return (
        <div className="w-[275px] h-[250px] border-mustard border-[15px] bg-beige flex flex-col items-center justify-center">
            { imageURL ? 
                (<div className="w-[245px] h-[220px] overflow-hidden">
                    <img
                        src={imageURL}
                        className="w-full h-full"
                    />
                </div>)
                :
                (<div 
                    className="text-espresso font-header font-semibold text-lg text-center cursor-pointer"
                    onClick={handleClick}
                >
                    <p className="mt-10">UPLOAD IMAGE</p>
                    <p>HERE</p>
                    <img src={UploadIcon} className="mt-5 mx-auto"/>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={imgUploadRef}
                        onChange={handleImgUpload}
                    >
                    </input>
                </div>)
            }
        </div>
    )

}

export default ImgUpload