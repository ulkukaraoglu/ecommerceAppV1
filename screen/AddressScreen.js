import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddressScreen = () => {
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      const userToken = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');

      // Eğer token veya user null ise işlemi sonlandır
      if (!userToken || !user) {
        Alert.alert("Hata", "Kullanıcı doğrulaması yapılamadı.");
        return;
      }

      setToken(userToken);
      const parsedUser = JSON.parse(user);
      setUserId(parsedUser.id);

      fetch(`https://fakestoreapi.com/users/${parsedUser.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.address) {
            setCity(json.address.city || '');
            setStreet(json.address.street || '');
            setNumber(json.address.number ? json.address.number.toString() : '');
            setPostalCode(json.address.zipcode || '');
          } else {
            Alert.alert("Hata", "Adress bilgileri bulunamadı.");
          }
        })
        .catch((err) => {
          console.log('Adress bilgileri alınamadı:', err);
          Alert.alert("Hata", "Adress bilgileri alınırken bir hata oluştu.");
        });
    };

    fetchAddress();
  }, [token, userId]); // Bağımlılık listesi

  const handleUpdate = () => {
    if (token && userId) {
      fetch(`https://fakestoreapi.com/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: {
            city: city,
            street: street,
            number: number ? parseInt(number) : 0, // NaN hatasını önlemek için
            zipcode: postalCode,
          },
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          Alert.alert("Başarılı", "Adress bilgileri güncellendi.");
          console.log(json);
        })
        .catch((err) => {
          console.log('Adress güncellenemedi:', err);
          Alert.alert("Hata", "Adress güncellenirken bir hata oluştu.");
        });
    } else {
      Alert.alert("Hata", "Kullanıcı doğrulaması yapılamadı.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />

      <View style={styles.form}>
        <View style={styles.group}>
          <Text style={styles.label}>Şehir</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Sokak</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>No</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={setNumber}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Posta Kodu</Text>
          <TextInput
            style={styles.input}
            value={postalCode}
            onChangeText={setPostalCode}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Güncelle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#ADD8E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2C82C9',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  group: {
    padding: 10
  }
});

export default AddressScreen;
