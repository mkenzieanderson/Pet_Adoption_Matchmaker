import UploadIcon from "../../assets/upload_icon.png";


// type ImgUploadProps = {

// }

function ImgUpload () {
    return (
        <div className="w-[275px] h-[250px] border-mustard border-[15px] bg-beige flex flex-col items-center justify-center">
            <div className="text-espresso font-header font-semibold text-lg text-center">
                <p className="mt-10">UPLOAD IMAGE</p>
                <p>HERE</p>
                <img src={UploadIcon} className="mt-5 mx-auto"/>
            </div>
        </div>
    )

}

export default ImgUpload