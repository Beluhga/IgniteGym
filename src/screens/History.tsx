import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, Text, VStack } from "native-base";
import { SectionList } from "native-base";
import {useState} from 'react';

export function History() {
    const [exercicios, setExercicios] = useState([
        {
            title: '26.08.23',
            data: ['Puxada Alta', 'Onion Rings', 'Fried Shrimps'],
        },
        {
            title: '28.08.23',
            data: ['Supino'],
        }


]);
    return (
        <VStack flex={1}>
                <ScreenHeader title="Historico de Exercícios" />

                <SectionList 
                    sections={exercicios}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                        <HistoryCard />
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
        </VStack>
    )
}