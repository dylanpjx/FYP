import axios from "axios";
import { useState } from 'react';

const API_URL = "http://localhost:8080/";

const FileUpload = () => {

    const [uploadFile, setUploadFile] = useState("");
    
    const handleFileReader = (event) => {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          setUploadFile({data:reader.result.split(',').pop(),fileName:event.target.files[0].name})
        };
        console.log(`File uploaded: ${event.target.files[0].name}`);
    };

    const uploadHandler = async () => {
        try{
        await axios.post(`${API_URL}/uploaded_file`, uploadFile);
        } catch (err){
        console.log(`Error: ${err.message}`);
        }
    };

  return (
    <div className="FileUpload">
       <label>Select a Folder</label>
       <br />
        <input
            id="file-upload"
            onChange={handleFileReader}                
            type="file"
            accept=".zip,.rar,.7zip"
        />
        <br />
        <button onClick={uploadHandler}>Upload Folder</button> 
    </div>
  )
}

export default FileUpload