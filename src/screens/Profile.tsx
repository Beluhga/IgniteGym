import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {  Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import {useForm, Controller} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';
import { useAuth } from "@hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import DefaultUserPhotoImg from '@assets/userPhotoDefault.png';



const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
    confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password')], 'A confirmação de senha não é confere')
    .when('password', {
        is: (Field: any) => Field,
        then: (schema) => 
        schema.nullable()
        .required('Informe a confirmação da senha')
        .transform((value) => !!value ? value : null)
    })
});

export function Profile() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [carregarFoto, setCarregarFoto] = useState(false);

    const toast = useToast();
    const { user, atualizarProfileUsuario } = useAuth();
    const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
        },
        resolver: yupResolver(profileSchema),
    });


    async function AbrirUserPhotoSelect() {
        setCarregarFoto(true);

        try {
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // para escolher o tipo de midia pra usar nas fotos
            quality: 1,
            aspect: [4, 4], // foto estilo 4x4
            allowsEditing: true, // para região que deseja usar na foto e corta
        }); // para acessar o album do usuario

       
        if (photoSelected.canceled){
            return;
        }

        if (photoSelected.assets[0].uri){
            const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

            if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){ // calculo para verificar imagem acima de 5MB
                return toast.show({
                    title: 'Essa image é muito grande. Escolha uma de até 5MB.',
                    placement: 'top', // para aparecer a menssagem no topo
                    bgColor: 'red.500'
                });
            }

            const fileExtesion = photoSelected.assets[0].uri.split('.').pop();  // extenção da imagem

            const photoFile = {
                name: `${user.name}.${fileExtesion}`.toLowerCase(),
                uri: photoSelected.assets[0].uri,
                type: `${photoSelected.assets[0].type}/${fileExtesion}`
            } as any;

            const FormularioDeCarregamentoDeFotoDeUsuario = new FormData();
                FormularioDeCarregamentoDeFotoDeUsuario.append('avatar', photoFile);

                const avatarRespostaAtualizada = await api.patch('/users/avatar', FormularioDeCarregamentoDeFotoDeUsuario, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    } // esse é o novo conteudo do Content-type. Para exibir a foto do usuario, que esta no profile
                })

                const atualizacaoDeUsuario = user;
                atualizacaoDeUsuario.avatar = avatarRespostaAtualizada.data.avatar;
                atualizarProfileUsuario(atualizacaoDeUsuario);

                console.log(atualizacaoDeUsuario)

                toast.show({
                    title: 'Foto atualizada',
                    placement: 'top',
                    bgColor: 'green.500'
                });
             
        }

    } catch (error) {
        console.log(error)
    } finally {
        setCarregarFoto(false);
    }

    }

    async function handleProfileUpdate(data: FormDataProps){
        try {
            setIsUpdating(true);

            const userUpdated = user; // pega o nome do usuario
            userUpdated.name = data.name; // atualiza o nome do usuario

            await api.put('/users', data);

            await atualizarProfileUsuario(userUpdated);

            toast.show({
                title: 'Perfil atualizado com sucessso!',
                placement: 'top',
                bgColor: 'gray.500'
            });
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar dados. Tente novamente mais tarde'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
        });
        }finally {
            setIsUpdating(false)
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
                        source={user.avatar 
                            ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} // procurando na url a foto do usuario
                            : DefaultUserPhotoImg}
                            alt= "Foto do Usuario"
                            size={PHOTO_SIZE}
                        />
                    }

                    <TouchableOpacity onPress={AbrirUserPhotoSelect}>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Controller
                        control={control}
                        name="name"
                        render={({field: {value, onChange}}) =>(
                            <Input 
                                placeholder="Nome"
                                bg="gray.600"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({field: {value, onChange}}) =>(
                            <Input 
                            placeholder="E-mail"
                            bg="gray.600"
                            isDisabled
                            onChangeText={onChange}
                            value={value}
                            />
                        )}
                    />

                    <Heading color="gray.200" fontSize="md" mb={2} mt={12} alignSelf="flex-start" fontFamily="heading">
                        Alterar senha
                    </Heading>

                    <Controller
                        control={control}
                        name="old_password"
                        render={({field: { onChange}}) =>(
                            <Input 
                                bg="gray.600"
                                placeholder="Senha antiga"
                                secureTextEntry
                                onChangeText={onChange}
                        />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({field: { onChange}}) =>(
                            <Input 
                                bg="gray.600"
                                placeholder="Nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({field: { onChange}}) =>(
                            <Input 
                            bg="gray.600"
                            placeholder="Confirma a nova senha"
                            secureTextEntry
                            onChangeText={onChange}
                            errorMessage={errors.confirm_password?.message}

                        />
                        )}
                    />

                    <Button 
                        title="Atualizar"
                        mt={4}
                        onPress={handleSubmit(handleProfileUpdate)}
                        isLoading={isUpdating}
                        />


                </Center>
            </ScrollView>
        </VStack>
    )
}