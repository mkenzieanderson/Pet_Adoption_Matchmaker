import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import UploadIcon from "../../assets/upload_icon.png";
import pitbull from "../../assets/pitbull.png";


// type ImgUploadProps = {

// }

function ImgUpload () {
    const navigate = useNavigate();
    const [imageURL, setImageURL] = useState<string | null>(null)

    return (
        <div className="w-[275px] h-[250px] border-mustard border-[15px] bg-beige flex flex-col items-center justify-center">
            { imageURL ? 
                (<div className="w-[245px] h-[220px] overflow-hidden">
                    <img
                        src={imageURL}
                        className="w-full h-full"
                        onClick={() => setImageURL(null)}
                    />
                </div>)
                :
                (<div 
                    className="text-espresso font-header font-semibold text-lg text-center cursor-pointer"
                    onClick={() => setImageURL(pitbull)}
                >
                    <p className="mt-10">UPLOAD IMAGE</p>
                    <p>HERE</p>
                    <img src={UploadIcon} className="mt-5 mx-auto"/>
                </div>)
            }
        </div>
    )

}

export default ImgUpload