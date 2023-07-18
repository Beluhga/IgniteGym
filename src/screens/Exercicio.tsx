import {  Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import {Feather} from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { Button } from "@components/Button";

type RouteParamsProps = {
    exerciseId: string
}


export function Exercicio() {
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const route = useRoute();

    const {exerciseId} = route.params as RouteParamsProps;

    function AbrirGoBack() {
        navigation.goBack();
    }

    return (
        <VStack flex={1}>
            <VStack px={8} bg="gray.600" pt={12} >
                    <TouchableOpacity onPress={AbrirGoBack}>
                        <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
                    </TouchableOpacity>

                    <HStack  justifyContent="space-between" mt={4} mb={8} alignItems="center">
                        <Heading flexShrink={1} color="gray.100" fontSize="lg" fontFamily="heading"> 
                            Puxada frontal
                        </Heading>

                        <HStack alignItems="center">
                            <BodySvg />
                                <Text color="gray.200" ml={1} textTransform="capitalize">
                                    costas
                                </Text>
                        </HStack>
                    </HStack>

                    
            </VStack>
            <ScrollView>
                <VStack p={8}>
                    <Image
                        w="full"
                        h={80}
                        source={{uri: 'https://static.wixstatic.com/media/2edbed_f1db2127f3dd4b83950b27b543386e42~mv2.gif'}}
                        alt="Nome do exercicio"
                        mb={3}
                        resizeMode="cover"
                        rounded="lg"
                        overflow="hidden"
                    />

                    <Box bg="gray.600" rounded="md" pb={4} px={4}>
                        <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
                            <HStack>
                                <SeriesSvg />
                                <Text color="gray.200" ml={2}>
                                    3 séries
                                </Text>
                            </HStack>

                            <HStack>
                                <RepetitionsSvg />
                                <Text color="gray.200" ml={2}>
                                    12 repetições
                                </Text>
                            </HStack>
                        </HStack>
                    <Button 
                        title="Marcar como realizado"
                    />
                    </Box>
                </VStack>
                </ScrollView>

        </VStack>
    )
}