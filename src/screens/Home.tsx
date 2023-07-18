import {useCallback, useEffect, useState} from 'react';
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import {  FlatList, HStack, Heading, Text, VStack, useToast } from "native-base";
import { ExercicioCard } from '@components/ExercicioCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Loading } from '@components/Loading';


export function Home() {
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState<string[]>([])
    const [exercicios, setExercicios] = useState<ExerciseDTO[]>([])
    const [groupSelected, setGroupSelected] = useState('costas')

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function AbrirOsDetalhesDoExercicio(exerciseId: string) {
        navigation.navigate('exercicio', {exerciseId});
    }

    async function buscarGrupos(){
        try {
            const response = await api.get('/groups');
            setGroups(response.data)
            
        } catch (error){
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel carregar os grupos musculares"
           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    async function buscarExerciciosPeloGrupo(){
        try{
            setIsLoading(true);

            const resposta = await api.get(`/exercises/bygroup/${groupSelected}`);
            setExercicios(resposta.data)

        }catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel pegar os exercicios"
           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally {
            setIsLoading(false);
 
        }

    }

    useEffect(() => {
        buscarGrupos();
    }, [])

    useFocusEffect(useCallback(() => {
        buscarExerciciosPeloGrupo()
    }, [groupSelected]))

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList 
                data={groups}
                keyExtractor={item => item}
                renderItem={({item}) => (

                    <Group 
                    name={item}
                    isActive={String(groupSelected).toLocaleUpperCase() === String(item).toLocaleUpperCase()}
                    onPress={() => setGroupSelected(item)}
                     />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{px:8}}
                my={10}
                minH={10}
                maxH={10}
            />

            { 
            isLoading ? <Loading /> :
            <VStack flex={1} px={8}>
                <HStack justifyContent={"space-around"} mb={5}>
                    <Heading color="gray.200" fontSize="md" fontFamily="heading">
                        Exercícios
                    </Heading>

                    <Text color="gray.200" fontSize="sm">
                        {exercicios.length}
                    </Text>
                </HStack>

                <FlatList 
                    data={exercicios}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => ( 
                    <ExercicioCard 
                        data={item}
                        onPress={() => AbrirOsDetalhesDoExercicio(item.id)}
                    />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20}}
                />

            </VStack>
            }

        </VStack>
    )
}