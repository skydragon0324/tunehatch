import React, { useEffect, useState } from "react";
import BROKEN_IMAGE from "../../../../Images/ChickLogo.png";
import { formUpdate } from "../../../../Redux/User/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../../hooks";

export default function ImageArrayUploader(props: {
  form: string;
  field: string;
  defaultImages?: any[];
  limit: number;
}) {
  const form = useAppSelector((state) => state.user.forms[props.form]);
  const dispatch = useAppDispatch();
  // var defaultImages = props.defaultImages;
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    setImages(initializeDefaultImages());
  }, [props.defaultImages, props.limit]);

  const initializeDefaultImages = () => {
    let defaultImages = Array(props.limit).fill(null);

    if (props.defaultImages && props.defaultImages.length) {
      props.defaultImages.forEach((image, i) => {
        if (i < props.limit) {
          defaultImages[i] = image;
        }
      });
    }

    return defaultImages;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);

    const files = event.target.files;

    if (!files || files.length === 0) {
      setImagePreviews([]);
      return;
    }

    if (files.length > props.limit) {
      setErrorMessage("You can only upload up to 3 images.");
      return;
    }

    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        newPreviews.push(reader.result as string);

        if (newPreviews.length === files.length) {
          setImagePreviews(newPreviews);
          setSelectedImageIndex(null);
        }
      };

      reader.readAsDataURL(file);
    }
  };
  let defaultImages: any[] = [];
  if (props.defaultImages) {
    if (props.defaultImages.length) {
      let newImages = Array(props.limit).fill(BROKEN_IMAGE);
      defaultImages.forEach((image, i) => {
        newImages[i] = image;
      });
      defaultImages = newImages;
    } else {
      defaultImages = Array(props.limit).fill(BROKEN_IMAGE);
    }
  } else {
    defaultImages = Array(props.limit).fill(BROKEN_IMAGE);
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleDisplay = () => {
    let tempValues: string[] = [...images];
    let tempImages = [...images];

    imagePreviews.forEach((preview, i) => {
      if (selectedImageIndex !== null && selectedImageIndex === i) {
        tempImages[selectedImageIndex] = preview;
        tempValues[selectedImageIndex] = imagePreviews[selectedImageIndex];
      } else if (i >= props.limit) {
        // Remove extra previews beyond the limit
        tempImages.pop();
        tempValues.pop();
      } else if (tempImages.length <= i) {
        // Add new previews if needed
        tempImages.push(preview);
        tempValues.push(imagePreviews[i]);
      }
    });

    setImages(tempImages);

    dispatch(
      formUpdate({
        form: props.form,
        field: props.field,
        value: tempValues,
      })
    );
  };

  return (
    <div className="flex flex-row ml-2">
      <input
        className="w-1/2"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        multiple
        onBlur={handleDisplay}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div className="w-1/3">
        {imagePreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index + 1}`}
            className={`w-1/2 ml-2 cursor-pointer flex flex-row ${
              selectedImageIndex === index ? "border border-blue-500" : ""
            }`}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
