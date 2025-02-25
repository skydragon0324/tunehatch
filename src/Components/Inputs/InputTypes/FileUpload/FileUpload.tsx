import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../../hooks";
import { formAppend, formUpdate } from "../../../../Redux/User/UserSlice";
import TargetLabel from "../../../Buttons/TargetLabel";

export default function FileUpload(props: {
  form: string;
  field: string;
  defaultValue?: any[];
  limit: number;
}) {
  const dispatch = useAppDispatch();
  const limit = props.limit || 3;
  const getLength = () => {
    let nonEmptyFiles = files?.filter((file) => file !== null)?.length || 0;
    return nonEmptyFiles > limit ? limit : nonEmptyFiles;
  };
  const [files, setFiles] = useState(props.defaultValue || []);
  const [length, setLength] = useState(getLength());

  const removeFile = useCallback(
    (file: { [key: string]: any }) => {
      const index = files.findIndex(
        (existingFile) => file.name === existingFile.name
      );
      if (index !== -1) {
        let newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
      }
    },
    [files]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newFiles = [...files];
    newFiles[length] = e.target.files[0];
    setFiles(newFiles);
  };
  useEffect(() => {
    let existingFileNames = [];
    let existingFilePaths = [];
    let newFiles = [];
    for (const testFile of files) {
      if (testFile) {
        if (testFile.size) {
          newFiles.push(testFile);
        } else {
          existingFileNames.push(testFile.name);
          existingFilePaths.push(testFile.location);
        }
      }
    }

    dispatch(
      formUpdate({
        form: props.form,
        field: props.field,
        value: newFiles,
      })
    );
    // if (existingFileNames.length) {
    dispatch(
      formUpdate({
        form: props.form,
        field: props.field + "_existingFileNames",
        value: existingFileNames,
      })
    );
    // }
    // if (existingFilePaths.length) {
    dispatch(
      formUpdate({
        form: props.form,
        field: props.field + "_existingFilePaths",
        value: existingFilePaths,
      })
    );
    // }
  }, [files]);

  useEffect(() => {
    setLength(getLength());
  }, [files]);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {files.map((file, i) => {
          if (file && i < limit) {
            return (
              <TargetLabel
                key={file.name}
                name={file.name}
                canCancel
                cancelFn={() => removeFile(file)}
              />
            );
          }
          return <></>;
        })}
      </div>
      {length < limit && (
        <span
          className={`relative ml-2 flex mt-1 flex-shrink items-center flex-grow-0 border rounded-full p-1 overflow-hidden pr-2`}
        >
          Upload Attachment
          <input
            type="file"
            className="opacity-0 absolute w-full h-full"
            onChange={(e) => handleChange(e)}
          />
        </span>
      )}
    </>
  );
}
