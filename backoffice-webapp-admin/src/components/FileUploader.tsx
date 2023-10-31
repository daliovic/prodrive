import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

export const FileUploader = () => {
  const toast = useRef<any>(null);

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  return (
    <div>
      <Toast ref={toast}></Toast>

      <FileUpload
        // name="demo[]"
      
        onUpload={onUpload}
        onError={(e) => {
          console.log(e.files);
        }}
        uploadHandler={(e)=>{console.log(e.files)}}
        multiple
        accept="image/*"
        maxFileSize={1000000}
        emptyTemplate={
          <p className="p-m-0">Drag and drop files to here to upload.</p>
        }
      />
    </div>
  );
};

export default FileUploader;
