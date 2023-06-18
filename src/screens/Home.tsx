import {useState} from 'react';
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import {  FlatList, HStack, Heading, Text, VStack } from "native-base";
import { ExercicioCard } from '@components/ExercicioCard';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

export function Home() {
    const [groups, setGroups] = useState(['costas', 'biceps', 'triceps', 'ombro'])
    const [exercicios, setExercicios] = useState(['1', '2', '3', '4'])
    const [groupSelected, setGroupSelected] = useState('costas')

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function AbrirOsDetalhesDoExercicio() {
        navigation.navigate('exercicio');
    }

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
                    keyExtractor={item => item}
                    renderItem={({ item }) => ( 
                    <ExercicioCard 
                        onPress={AbrirOsDetalhesDoExercicio}
                    />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20}}
                />

            </VStack>

        </VStack>
    )
}