import React, { useRef, useState } from "react";
import { useAppDispatch } from "../../../hooks";
import BROKEN_IMAGE from "../../../Images/ChickLogo.png";
import CoverImage from "../../../Images/Banners/DefaultProfileBanner.jpg";
// import { IMAGE_URL } from "../../../Helpers/configConstants";
import { formUpdate } from "../../../Redux/User/UserSlice";
import IconButton from "../../Buttons/IconButton";
import Img from "../../Images/Img";

export default function BannerAvatarUpload(props: {
  avatar: string;
  banner?: any;
  form: any;
  bannerField?: any;
}) {
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState(
    props.avatar ? props.avatar : BROKEN_IMAGE
  );
  const [banner, setBanner] = useState(
    props.banner ? props.banner : CoverImage
  );
  const avatarButton = useRef<any>();
  const bannerButton = useRef<any>();

  const handleDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "avatar") {
      // const file = URL.createObjectURL(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name.includes("banner")) {
      setBanner(URL.createObjectURL(e.target.files[0]));
    } else {
      console.error(
        "Attempted to upload to a non-supported field. Field name: " +
          e.target.name
      );
      return false;
    }
    dispatch(
      formUpdate({
        form: props.form,
        field: e.target.name,
        value: e.target.files[0],
      })
    );
  };

  return (
    <div className="w-full relative mb-14">
      <Img
        src={banner}
        alt="Banner Preview"
        className="absolute w-full h-full"
      />
      <div className="flex w-full relative items-center flex-col pt-8">
        <Img
          className="relative rounded-full top-14 h-48 w-48 bg-white border-2"
          src={avatar}
          onClick={(e: React.MouseEvent) => {
            avatarButton.current.click();
          }}
          alt="Avatar Preview"
        />
        <IconButton
          className="absolute right-1 bottom-1 opacity-70 text-md"
          icon="photo_camera"
          iconColor="text-white"
          onClick={() => bannerButton.current.click()}
        />

        <IconButton
          className="text-md text-center z-20 absolute -bottom-12"
          icon="photo_camera"
          iconColor="text-white"
          onClick={(e: React.MouseEvent) => {
            if (e) {
              e.stopPropagation();
            }
            avatarButton.current.click();
          }}
        />
      </div>
      <input
        type="file"
        name="avatar"
        className="hidden"
        ref={avatarButton}
        onChange={(e) => handleDisplay(e)}
      />
      <input
        type="file"
        name={props.bannerField}
        className="hidden"
        ref={bannerButton}
        onChange={(e) => handleDisplay(e)}
      />
    </div>
  );
}
