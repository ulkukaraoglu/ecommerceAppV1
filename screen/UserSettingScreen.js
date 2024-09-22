import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';

const UserSettingScreen = () => {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState(user?.name?.firstname || '');
    const [lastName, setLastName] = useState(user?.name?.lastname || '');
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const handleUpdate = () => {
        const updatedUser = {
            ...user,
            name: {
                firstname: firstName,
                lastname: lastName,
            },
            username: username,
            email: email,
            phone: phone,
        };

        setUser(updatedUser);
        Alert.alert("Başarılı", "Bilgileriniz güncellendi.");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Hesap Bilgileri</Text>
            </View>

            <Text style={styles.label}>Ad</Text>
            <TextInput
                style={styles.input}
                value={firstName} // Kullanıcının mevcut adı gösteriliyor
                onChangeText={setFirstName} // Kullanıcı değişiklik yaparsa, state güncelleniyor
            />

            <Text style={styles.label}>Soyad</Text>
            <TextInput
                style={styles.input}
                value={lastName} // Kullanıcının mevcut soyadı gösteriliyor
                onChangeText={setLastName} // Kullanıcı değişiklik yaparsa, state güncelleniyor
            />

            <Text style={styles.label}>Kullanıcı Adı</Text>
            <TextInput
                style={styles.input}
                value={username} // Kullanıcının mevcut kullanıcı adı gösteriliyor
                onChangeText={setUsername} // Kullanıcı değişiklik yaparsa, state güncelleniyor
            />

            <Text style={styles.label}>E-posta</Text>
            <TextInput
                style={styles.input}
                value={email} // Kullanıcının mevcut e-postası gösteriliyor
                onChangeText={setEmail} // Kullanıcı değişiklik yaparsa, state güncelleniyor
            />

            <Text style={styles.label}>Telefon</Text>
            <TextInput
                style={styles.input}
                value={phone} // Kullanıcının mevcut telefon numarası gösteriliyor
                onChangeText={setPhone} // Kullanıcı değişiklik yaparsa, state güncelleniyor
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Güncelle</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        backgroundColor: '#70D4DF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    button: {
        backgroundColor: '#2C82C9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserSettingScreen;
