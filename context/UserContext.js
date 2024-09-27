import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserFromStorge = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Kullanıcı bilgisi yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadUserFromStorge();
    }, []);

    // const saveUserToStroge = async (userData) => {
    //     try {
    //         await AsyncStorage.setItem('user', JSON.stringify(userData));
    //         setUser(userData);
    //     } catch (error) {
    //         console.error("kullanıcı bilgi kaydı başarısız", error);
    //     }
    // };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
