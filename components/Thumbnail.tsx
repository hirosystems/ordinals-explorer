import { CSSProperties } from "react";

import { cn } from "../lib/helpers";
import IconAudio from "./icons/IconAudio";
import IconFile from "./icons/IconFile";
import IconImage from "./icons/IconImage";
import IconText from "./icons/IconText";
import IconVideo from "./icons/IconVideo";
import Iframe from "./inscriptions/Iframe";

// todo: add more types
const safeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const ThumbnailIcon = ({
  inscription,
  showImage = true,
  className,
  style,
}: {
  inscription: { id: string; content_type: string };
  showImage?: boolean;
  className?: string;
  style?: CSSProperties;
}) => {
  const type = inscription.content_type.toLowerCase();

  if (type.startsWith("audio/"))
    return <IconAudio className={className} style={style} />;
  if (type.startsWith("video/"))
    return <IconVideo className={className} style={style} />;
  if (type.startsWith("text/"))
    return <IconText className={className} style={style} />;

  if (showImage && safeTypes.includes(inscription.content_type.toLowerCase()))
    return <Iframe src={`/preview/${inscription.id}`} />;
  if (type.startsWith("image/"))
    return <IconImage className={className} style={style} />;

  return <IconFile className={className} style={style} />;
};

const Thumbnail = ({
  inscription,
  showImage = true,
  className,
  style,
}: {
  inscription: { id: string; content_type: string };
  showImage?: boolean;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div
      className={cn(
        "w-full h-full flex justify-around items-center bg-neutral-50",
        className
      )}
    >
      <ThumbnailIcon
        inscription={inscription}
        showImage={showImage}
        className="w-1/2"
      />
    </div>
  );
};

export default Thumbnail;
