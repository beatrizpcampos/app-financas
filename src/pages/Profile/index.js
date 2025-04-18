import { useContext } from 'react';
import Header from '../../components/Header';
import { 
    Container, 
    Message, 
    Name, 
    NewLink, 
    NewText, 
    LogoutButton, 
    LogoutText 
} from './styles';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
    const { user, signOut } = useContext(AuthContext)
    const navigation = useNavigation()

    return (
        <Container>
            <Header title="Minha conta" />

            <Message>Ola, bem seja vindo(a) de volta</Message>

            <Name numberOfLines={1}>
               {user && user.name}
            </Name>

            <NewLink onPress={ () => navigation.navigate('Register') }>
                <NewText>Cadastrar movimentação</NewText>
            </NewLink>

            <LogoutButton onPress={ () => signOut() }>
                <LogoutText>Sair</LogoutText>
            </LogoutButton>

        </Container>
    );
}