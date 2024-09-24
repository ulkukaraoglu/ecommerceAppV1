import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const AddressScreen = () => {
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [initialCity, setInitialCity] = useState('');
  const [initialStreet, setInitialStreet] = useState('');
  const [initialNumber, setInitialNumber] = useState('');
  const [initialPostalCode, setInitialPostalCode] = useState('');
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAddress = async () => {
      const userToken = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');

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

            setInitialCity(json.address.city || '');
            setInitialStreet(json.address.street || '');
            setInitialNumber(json.address.number ? json.address.number.toString() : '');
            setInitialPostalCode(json.address.zipcode || '');
          } else {
            Alert.alert("Hata", "Adres bilgileri bulunamadı.");
          }
        })
        .catch((err) => {
          Alert.alert("Hata", "Adres bilgileri alınırken bir hata oluştu.");
        })
        .finally(() => {
          setIsLoading(false); // Veri çekme bitince yüklemeyi durdur
        });
    };

    fetchAddress();
  }, []);

  const handleUpdate = () => {
    if (
      city === initialCity &&
      street === initialStreet &&
      number === initialNumber &&
      postalCode === initialPostalCode
    ) {
      Alert.alert("Uyarı", "Herhangi bir değişiklik yapmadınız.");
      return;
    }

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
            number: number ? parseInt(number) : 0,
            zipcode: postalCode,
          },
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          Alert.alert("Başarılı", "Adres bilgileri güncellendi.");
          setInitialCity(city);
          setInitialStreet(street);
          setInitialNumber(number);
          setInitialPostalCode(postalCode);
        })
        .catch((err) => {
          console.log('Adres güncellenemedi:', err);
          Alert.alert("Hata", "Adres güncellenirken bir hata oluştu.");
        });
    } else {
      Alert.alert("Hata", "Kullanıcı doğrulaması yapılamadı.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />

      <View style={styles.form}>
        {isLoading ? (
          <Text>Yükleniyor...</Text> //veri yükleme
        ) : (
          <>
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
          </>
        )}
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
    padding: 10,
  },
});

export default AddressScreen;
