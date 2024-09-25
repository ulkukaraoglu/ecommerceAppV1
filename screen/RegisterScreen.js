import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert, StatusBar } from "react-native";
import React, { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastName] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    if (!username || !password || !firstname || !lastname) {
      Alert.alert("Boş Alan", "Lütfen tüm alanları doldurunuz")
      return;
    }

    fetch('https://fakestoreapi.com/users', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 21,
        email: 'defaultemail@gmail.com',
        username: username,
        password: password,
        name: {
          firstname: firstname,
          lastname: lastname
        },
        address: {
          city: 'Default City',
          street: 'Default Street',
          number: 1,
          zipcode: '00000',
          geolocation: {
            lat: '-37.3159',
            long: '81.1496'
          }
        },
        phone: '000-000-0000'
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        Alert.alert("Kayıt başarılı", "Kullanıcı başarıyla oluşturuldu");
        navigation.navigate("MainScreen");
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Kayıt başarısız", "Kayıt oluşturulurken bir hata oluştu");
      });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />
      <View>
        <Image source={require("../pictures/logo.png")} style={styles.logo} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 0, color: "#041E42" }}>
            Hesap Oluşturunuz
          </Text>
        </View>

    
        <View style={{ marginTop: 5 }}>
          <View style={styles.inputField}>
            <Ionicons name="person" size={24} color="gray" style={{ marginLeft: 8 }} />
            <TextInput
              value={firstname}
              onChangeText={setFirstname}
              style={styles.inputText}
              placeholder="Adınızı giriniz"
            />
          </View>
        </View>

        <View style={{ marginTop: 5 }}>
          <View style={styles.inputField}>
            <Ionicons name="person" size={24} color="gray" style={{ marginLeft: 8 }} />
            <TextInput
              value={lastname}
              onChangeText={setLastName}
              style={styles.inputText}
              placeholder="Soyadınızı giriniz"
            />
          </View>
        </View>

        <View style={{ marginTop: 5 }}>
          <View style={styles.inputField}>
            <Ionicons name="person" size={24} color="gray" style={{ marginLeft: 8 }} />
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={styles.inputText}
              placeholder="Kullanıcı adınızı giriniz"
            />
          </View>
        </View>

        <View style={{ marginTop: 5 }}>
          <View style={styles.inputField}>
            <AntDesign name="lock" size={24} color="gray" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.inputText}
              placeholder="Şifrenizi giriniz"
            />
          </View>
        </View>

        <View style={{ marginTop: 50 }} />

        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
          <Text style={styles.loginText}>Hesabınız var mı? Giriş Yap</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  logo: {
    width: 270,
    height: 250,
    resizeMode: 'contain',
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D0D0D0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
    paddingHorizontal: 8,
  },
  inputText: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  button: {
    width: 200,
    backgroundColor: "#FEBE10",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});
