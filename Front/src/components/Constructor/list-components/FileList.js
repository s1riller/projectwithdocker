import React, { useState } from "react";
import exitIcon from '../../img/exit.svg'
import uploadIcon from '../../img/upload.svg'
import pdfIcon from '../../img/pdf.svg'
import wordIcon from '../../img/word.svg'
import videoIcon from '../../img/video-file.svg'


function FileList(props){
    const [name, setName] = useState(props.name);
    const [type, setType] = useState(props.type)
    const [file, setFile] = useState(props.file);

    const onLoad = () => {
        let blob = new Blob([file], {type: type});

        let link = document.createElement('a');
        
        link.download = name;
        link.href = file;
        link.type = type;

        link.click();

        URL.revokeObjectURL(link.href);
    }

    return(
        <div className="file-field">
            <div className="file-info">
                <p className="text-4">{name}</p>
                {
                    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                        <img src={wordIcon} alt='icon' className="file"/> :
                    type === "application/pdf" ? 
                        <img src={pdfIcon} alt='icon' className="file"/> :
                    type === "video/mp4" ? 
                        <img src={videoIcon} alt='icon' className="file"/> :
                        <img src={file} alt='icon' className="file"/>
                }
            </div>
            <div className="file-buttons">
                <img src={uploadIcon} onClick={() => onLoad(file)} className="file-upload" alt='Скачать'/>
                <img src={exitIcon} onClick={() => props.onDelete(file)} className="file-delete" alt='Удалить'/>
            </div>
            
        </div>
    )
}

export default FileList