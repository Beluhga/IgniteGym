import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo} from '@expo/vector-icons';
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "@services/api";


type Props = TouchableOpacityProps & {
    data: ExerciseDTO;
}

export function ExercicioCard({data, ...restante}: Props){
    return(
        <TouchableOpacity {...restante}>
            <HStack bg="gray.500" alignItems="center" mb={3} p={2} pr={4} rounded="md">
                <Image
                    source={{uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`}}
                    alt="exercício de costa"
                    w={16}
                    h={16}
                    rounded="md"
                    mr={4}
                    resizeMode="cover"
                />

                <VStack flex={1}>
                    <Heading fontSize="lg" color="white" fontFamily="heading">
                        {data.name}
                    </Heading>

                    <Text fontSize="sm" color="gray.200" numberOfLines={2} mt={1}>
                        {data.series} séries x {data.repetitions} repetições
                    </Text>
                </VStack>


                <Icon as={Entypo} name="chevron-small-right" color="gray.300" />
            </HStack>

        </TouchableOpacity>
    )
}