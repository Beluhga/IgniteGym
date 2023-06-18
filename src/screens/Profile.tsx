import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {  Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const PHOTO_SIZE = 33;

export function Profile() {

    const [carregarFoto, setCarregarFoto] = useState(false);
    const [ userPhoto, setUserPhoto] = useState('https://github.com/beluhga.png')

    const toast = useToast();

    async function AbrirUserPhotoSelect() {
        setCarregarFoto(true);

        try {
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // para escolher o tipo de midia pra usar nas fotos
            quality: 1,
            aspect: [4, 4], // foto estilo 4x4
            allowsEditing: true, // para região que deseja usar na foto e corta
        }); // para acessar o album do usuario


        if(photoSelected.cancelled){ // ou (photoSelected.canceled)
            return;
        }

        if(photoSelected.uri){
            const photoInfo = await FileSystem.getInfoAsync(photoSelected.uri);

            if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){ // calculo para verificar imagem acima de 5MB
                return toast.show({
                    title: 'Essa image é muito grande. Escolha uma de até 5MB.',
                    placement: 'top', // para aparecer a menssagem no topo
                    bgColor: 'red.500'
                });
                
            }

            setUserPhoto(photoSelected.uri); // ou (photoSelected.assets[0].uri)
        }
    } catch (error) {
        console.log(error)
    } finally {
        setCarregarFoto(false);
    }

    }

    return (
        <VStack flex={1}>
           <ScreenHeader title="Perfil" />
            <ScrollView contentContainerStyle={{paddingBottom: 36 }}>
                <Center mt={6} px={10}>
                    {
                    carregarFoto ?
                        <Skeleton w={PHOTO_SIZE} h={PHOTO_SIZE} rounded="full" startColor="gray.500" endColor="gray.400" />

                    :
                        <UserPhoto
                            source={{uri: userPhoto}}
                            alt= "Foto do Usuario"
                            size={PHOTO_SIZE}
                        />
                    }

                    <TouchableOpacity onPress={AbrirUserPhotoSelect}>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Input 
                        placeholder="Nome"
                        bg="gray.600"
                    />
                    <Input 
                        placeholder="E-mail"
                        bg="gray.600"
                        isDisabled
                    />

                    <Heading color="gray.200" fontSize="md" mb={2} mt={12} alignSelf="flex-start" fontFamily="heading">
                        Alterar senha
                    </Heading>

                    <Input 
                        bg="gray.600"
                        placeholder="Senha antiga"
                        secureTextEntry
                    />
                    <Input 
                        bg="gray.600"
                        placeholder="Nova senha"
                        secureTextEntry
                    />
                    <Input 
                        bg="gray.600"
                        placeholder="Confirme a nova senha"
                        secureTextEntry
                    />

                    <Button 
                        title="Atualizar"
                        mt={4}
                    />


                </Center>
            </ScrollView>
        </VStack>
    )
}