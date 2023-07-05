import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from "native-base";
import LogoSvg from '@assets/logo.svg';
import BackGroundImg from '@assets/background.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormData = {
    email: string;
    password: string;
}

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth()
    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const toast = useToast();

    const { control, handleSubmit, formState: { errors} } = useForm<FormData>();

    async function handleNewAccount(){
        await navigation.navigate('signUp')
    }

    async function AbrirSignIn({email, password}: FormData){
        try {
            setIsLoading(true);
            await signIn(email, password);

        } catch(error){
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possível entrat. Tenta novamente mais tarde"
            setIsLoading(false);

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <VStack flex={1} px={10} pb={16}>
            <Image 
                source={BackGroundImg}
                defaultSource={BackGroundImg} // imagem padrao
                alt="Pessoas Treinando"
                resizeMode="contain"
                position="absolute"
                />

            <Center my={24}> 
                <LogoSvg />
                    <Text color="gray.100" fontSize="sm">
                        Treine sua mente e seu corpo
                    </Text>
            </Center>

            <Center>
                <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                    Acesso a conta
                </Heading>
                <Controller 
                    control={control}
                    name="email"
                    rules={{required: 'Informe o e-mail'}}
                    render={({ field: {onChange} }) => (
                <Input
                 placeholder="E-mail" 
                 keyboardType="email-address"
                 onChangeText={onChange}
                 errorMessage={errors.email?.message}
                 autoCapitalize="none"
                />
                )}
                />

                <Controller 
                    control={control}
                    name="password"
                    rules={{required: 'Informe o e-mail'}}
                    render={({ field: {onChange} }) => (
                <Input
                 placeholder="Senha" 
                 secureTextEntry
                 onChangeText={onChange}
                 errorMessage={errors.password?.message}
                 />
                    )}
                />

                 <Button isLoading={isLoading} title="Acessar" onPress={handleSubmit(AbrirSignIn)} />
            </Center>

            <Center mt={23}>
                <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
                    Ainda não tem acesso?
                </Text>

                <Button title="Criar conta"  variant="outline" onPress={handleNewAccount} />
            </Center>

        </VStack>
    </ScrollView>
    );
}