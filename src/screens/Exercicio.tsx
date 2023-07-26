import {  Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from "native-base";
import { TouchableOpacity } from "react-native";
import {Feather} from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
    exerciseId: string
}


export function Exercicio() {
    const [enviarRegistro, setEnviarRegistro] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [exercicio, setExercicio] = useState<ExerciseDTO>({} as ExerciseDTO);
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const toast  = useToast();
    const route = useRoute();

    const {exerciseId} = route.params as RouteParamsProps;

    function AbrirGoBack() {
        navigation.goBack();
    }

    async function buscarDetalhesDoExercicios() {
        try {
            setIsLoading(true)
            const response = await api.get(`/exercises/${exerciseId}`)
            setExercicio(response.data)

        }catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel carregar os detalhes do exercicio"
           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })

        }finally {
            setIsLoading(false)
        }
    }

    async function handleExerciseHistoryRegister(){
        try {
            setEnviarRegistro(true);
            await api.post('/history',{exercise_id: exerciseId} )

            toast.show({
                title: 'Parabéns! Exercicio registrado no seu histórico',
                placement: 'top',
                bgColor: 'green.700'
            })

            navigation.navigate('history');

        } catch (error){
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel registrar o exercicio"
           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setEnviarRegistro(false)
        }
    }

    useEffect(() => {
        buscarDetalhesDoExercicios();
    }, [exerciseId])

    return (
        <VStack flex={1}>
            <VStack px={8} bg="gray.600" pt={12} >
                    <TouchableOpacity onPress={AbrirGoBack}>
                        <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
                    </TouchableOpacity>

                    <HStack  justifyContent="space-between" mt={4} mb={8} alignItems="center">
                        <Heading flexShrink={1} color="gray.100" fontSize="lg" fontFamily="heading"> 
                            {exercicio.name}
                        </Heading>

                        <HStack alignItems="center">
                            <BodySvg />
                                <Text color="gray.200" ml={1} textTransform="capitalize">
                                    {exercicio.group}
                                </Text>
                        </HStack>
                    </HStack>

                    
            </VStack>
            <ScrollView>
                
                {isLoading ? <Loading /> :
                <VStack p={8}>
                    <Box rounded="lg" mb={3} overflow="hidden">
                    <Image
                        w="full"
                        h={80}
                        source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercicio.demo}`}}
                        alt="Nome do exercicio"
                        resizeMode="cover"
                        rounded="lg"
                        overflow="hidden"
                    />
                    </Box>

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
                        isLoading={enviarRegistro}
                        onPress={handleExerciseHistoryRegister}
                    />
                    </Box>
                </VStack>
                }
                </ScrollView>

        </VStack>
    )
}