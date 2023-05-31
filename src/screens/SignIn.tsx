import { Image, VStack } from "native-base";
import LogoSvg from '@assets/logo.svg';

import BackGroundImg from '@assets/background.png'

export function SignIn(){
    return (
        <VStack flex={1} bg="gray.700">
            <Image 
                source={BackGroundImg}
                alt="Pessoas Treinando"
                resizeMode="contain"
                position="absolute"
                />

            <LogoSvg />

        </VStack>
    );
}