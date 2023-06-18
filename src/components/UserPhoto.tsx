import { Image, IImageProps } from "native-base";

type Props = IImageProps & {
    size: number;
}

export function UserPhoto({size, ...restanteETodasAsPropriedades}: Props){
    return (
        <Image 
            w={size}
            h={size}
            rounded="full"
            borderWidth={2}
            borderColor="gray.400"
            {...restanteETodasAsPropriedades}
        />
    )
}