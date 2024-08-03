import { StaticImageData } from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
type AvatarCompType = React.ComponentPropsWithoutRef<typeof Avatar> & { image: string, fallback: string }

function AvatarComp(props: AvatarCompType) {
  const {image, fallback, ...rest } = props;

  return (
    <Avatar {...rest}>
      <AvatarImage src={image} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

export default AvatarComp