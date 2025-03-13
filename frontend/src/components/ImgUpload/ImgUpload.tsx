import { useRef } from 'react';
import UploadIcon from "../../assets/upload_icon.png";

type ImgUploadProps = {
    imageFile: File | undefined;
    setImageFile: React.Dispatch<React.SetStateAction<File| undefined>>;
    avatarUrl?: string | null;
    loadingAvatar?: boolean;
}


function ImgUpload ({ imageFile, setImageFile, avatarUrl, loadingAvatar }: ImgUploadProps) {
    const imgUploadRef = useRef<HTMLInputElement>(null);

    const handleImgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const imgFile = event.target.files?.[0];
        if (imgFile) {
            setImageFile(imgFile);
        }
    };

    const handleClick = () => {
        imgUploadRef.current?.click();
    }

    return (
        <div className="w-[275px] h-[250px] border-mustard border-[15px] bg-beige flex flex-col items-center justify-center">           
                <div 
                    className="text-espresso font-header font-semibold text-lg text-center cursor-pointer"
                    onClick={handleClick}
                >                
                    {imageFile ? (
                        <div className="w-[245px] h-[220px] overflow-hidden">
                            <img
                                src={URL.createObjectURL(imageFile)}
                                className="w-full h-full object-cover"
                                alt="Uploaded Image"
                            />
                        </div>
                    ) : avatarUrl ? (
                        loadingAvatar ? (
                            <p>Loading avatar...</p>
                        ) : (
                            <div className="w-[245px] h-[220px] overflow-hidden">
                                <img
                                    src={avatarUrl}
                                    className="w-full h-full object-cover"
                                    alt="Pet Avatar"
                                />
                            </div>
                        )
                    ) : (
                        <>
                            <p className="mt-10">UPLOAD IMAGE</p>
                            <p>HERE</p>
                            <img src={UploadIcon} className="mt-5 mx-auto" />
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={imgUploadRef}
                        onChange={handleImgUpload}
                    >
                    </input>
                </div>
        </div>
    )
}

export default ImgUpload