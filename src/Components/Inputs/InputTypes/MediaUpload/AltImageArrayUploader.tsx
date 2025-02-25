import e from "express";
import React, { useEffect, useRef, useState } from "react";
import Img from "../../../Images/Img";
import { useAppDispatch } from "../../../../hooks";
import { formArrayUpdate } from "../../../../Redux/User/UserSlice";

export default function AltImageArrayUploader(props: {
  limit?: number;
  label?: string;
  form: string;
  field: string;
  defaultImages?: any[];
}) {
  const dispatch = useAppDispatch();
  const [limit, setLimit] = useState(props.limit || 3);

  const [imagePreviews, setImagePreviews] = useState(
    [...props.defaultImages.filter((image) => image !== null)] || []
  );
  const imageGallery = useRef<HTMLDivElement>(null);

  const setImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files[0]) {
      console.log("setting image");
      let images = imagePreviews;
      images[index] = URL.createObjectURL(e.target.files[0]);
      setImagePreviews([...images]);
      dispatch(
        formArrayUpdate({
          form: props.form,
          field: props.field,
          index: String(index),
          value: { file: e.target.files[0] },
        })
      );
      e.target.value = "";
    }
  };

  useEffect(() => {
    let width = imageGallery.current.scrollWidth;
    imageGallery.current.scrollTo({ left: width, behavior: "smooth" });
  }, [imagePreviews]);

  return (
    <>
      <div
        ref={imageGallery}
        className="flex flex-nowrap overflow-x-scroll h-72 gap-2 pr-10 pl-5 md:pr-2 md:pl-2 md:justify-center"
      >
        {imagePreviews.map((image, i) => {
          if (i < limit) {
            return (
              <>
                <div className="relative w-80 flex-shrink-0 h-full">
                  <input
                    type="file"
                    className="absolute w-full h-full opacity-0"
                    onChange={(e) => setImage(e, i)}
                  />

                  <Img key={i} src={image} className="w-full h-full border" />
                </div>
              </>
            );
          } else {
            return <p>nah</p>;
          }
        })}
        {imagePreviews.length < limit && (
          <>
            <div className="w-80 h-full flex-shrink-0 bg-gray-50 border relative flex items-center justify-center">
              <i className="material-symbols-outlined text-9xl font-black text-gray-300">
                upload
              </i>
              <input
                type="file"
                className="absolute w-full h-full opacity-0"
                onChange={(e) => setImage(e, imagePreviews.length)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
