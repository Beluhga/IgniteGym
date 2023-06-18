import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo} from '@expo/vector-icons';

type Props = TouchableOpacityProps & {

}

export function ExercicioCard({...restante}: Props){
    return(
        <TouchableOpacity {...restante}>
            <HStack bg="gray.500" alignItems="center" mb={3} p={2} pr={4} rounded="md">
                <Image
                    source={{uri: 'https://static.wixstatic.com/media/2edbed_f1db2127f3dd4b83950b27b543386e42~mv2.gif'}}
                    alt="exercício de costa"
                    w={16}
                    h={16}
                    rounded="md"
                    mr={4}
                    resizeMode="cover"
                />

                <VStack flex={1}>
                    <Heading fontSize="lg" color="white" fontFamily="heading">
                        Remada unilateral
                    </Heading>

                    <Text fontSize="sm" color="gray.200" numberOfLines={2} mt={1}>
                        3 séries x 10 repetições
                    </Text>
                </VStack>


                <Icon as={Entypo} name="chevron-small-right" color="gray.300" />
            </HStack>

        </TouchableOpacity>
    )
}