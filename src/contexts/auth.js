import { createContext, useEffect, useState } from "react";
import api from '../services/api'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({})

function AuthProvider({ children }){
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ loadingStorage, setLoadingStorage] = useState(true)

    const navigation = useNavigation()

    useEffect(() => {
        async function loadStorage() {
            const storageUser = await AsyncStorage.getItem('@finToken')

            if(storageUser){
                const response = await api.get('/me', {
                    headers:{
                        'Authorization': `Bearer ${storageUser}`
                    }
                })
                .catch(() => {
                    setUser(null)
                })

                api.defaults.headers['Authorization'] = `Bearer ${storageUser}`
                setUser(response.data)
                setLoadingStorage(false)
            }

            setLoadingStorage(false)
        }

        loadStorage()
    })

    async function signUp(nome, email, password) {
        setLoading(true)

        try{
            const response = await api.post('/users', {
                name: nome,
                email: email,
                password: password,
            })

            setLoading(false)

            navigation.goBack()

        }catch(err){
            console.log('erro ao cadastrar', err)
            setLoading(false)
        }
    }

    async function signIn(email, password) {
        setLoading(true)

        try {
            const response = await api.post('/login', {
                email: email,
                password: password,
            })

            const { id, name, token } = response.data

            const data = {
                id,
                name,
                token,
                email
            }

            await AsyncStorage.setItem('@finToken', token)
            
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            setUser({
                id,
                name,
                email,
            })

            setLoading(false)

        } catch (error) {
            console.log('Erro ao logar ', error)
            setLoading(false)
        }
    }

    async function signOut() {
        await AsyncStorage.clear()
        .then(() => {
            setUser(null)
        })
    }

    return(
        <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, signOut, loading, loadingStorage }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;