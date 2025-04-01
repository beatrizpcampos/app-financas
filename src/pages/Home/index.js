import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Background, ListBalance } from './styles';
import api from '../../services/api';
import Header from '../../components/Header';
import { format } from 'date-fns';
import { useIsFocused } from '@react-navigation/native';
import BalanceItem from '../../components/BalanceItem';

export default function Home() {
    const isFocused = useIsFocused()
    const { signOut, user } = useContext(AuthContext)
    const [listBalance, setListBalance] = useState([])
    const [dateMovements, setDateMovements] = useState(new Date())

    useEffect( () => {
        let isActive = true

        async function getMovements(){
            let dateFormated = format(dateMovements, 'dd/MM/yyyy')

            const balance = await api.get('/balance', {
                params: {
                    date: dateFormated
                }
            })

            if(isActive){
                setListBalance(balance.data)
            }
        }

        getMovements()

        return () => isActive = false
    }, [isFocused])

    return (
        <Background>
            <Header title='Transações'/>

            <ListBalance
                data={listBalance}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={ item => item.tag }
                renderItem={ ({ item }) => ( <BalanceItem data={item} /> )}
            />
        </Background>
    );
}