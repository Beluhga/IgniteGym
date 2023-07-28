import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryByDayDTO } from "@dtos/HistoryByDay";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Heading, Text, VStack, useToast } from "native-base";
import { SectionList } from "native-base";
import {useCallback, useState} from 'react';

export function History() {
    const [isLoading, setIsLoading] = useState(true);
    const [exercicios, setExercicios] = useState<HistoryByDayDTO[]>([]);

const toast = useToast();

async function buscarHistory() {

try {
    setIsLoading(true)
    const response = await api.get('/history');
    setExercicios(response.data)
        

} catch (error){
    const isAppError = error instanceof AppError;
    const title = isAppError ? error.message : "Não foi possivel carregar o historico"
           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally {
            setIsLoading(false)
        }
}

useFocusEffect(useCallback(() => { // usando quando a tela estiver no focu
    buscarHistory();
}, []))

    return (
        <VStack flex={1}>
                <ScreenHeader title="Historico de Exercícios" />


                {
                    isLoading ? <Loading /> :
                <SectionList 
                    sections={exercicios}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <HistoryCard data={item} />
                    )}
                    renderSectionHeader={({section}) => (
                        <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                            {section.title}
                        </Heading>
                    )}
                    px={8}
                    contentContainerStyle={exercicios.length === 0 && {flex: 1, justifyContent: 'center'}}
                    ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                            Não há exercícios registrados ainda. {'\n'}
                            Vamos fazer exercícios hoje?
                        </Text>
                    )}
                />
                }
        </VStack>
    )
}