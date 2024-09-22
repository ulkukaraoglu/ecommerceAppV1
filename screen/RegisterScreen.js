import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert, StatusBar } from "react-native";
import React, { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      username: username,
      email: email,
      password: password,
    };

    axios.get("https://fakestoreapi.com/users", user).then((response) => {
      console.log(response);
      Alert.alert("Kayıt Başarılı", "Kaydınız başarıyla yapılmıştır.");
      setName("");
      setUsername("");
      setPassword("");
      setEmail("");
    }).catch((error) => {
      Alert.alert("Kaydolma Hatası", "kayıt sırasında bir hata meydana geldi");
      console.log("Kayıt başarısız", error);
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />
      <View>
        <Image
          source={require("../pictures/logo.png")} style={styles.logo}
        />
      </View>

      <KeyboardAvoidingView behavior="pos">
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 0, color: "#041E42" }}>
            Hesap Oluşturunuz
          </Text>
        </View>

        <View style={{ marginTop: 5 }}>
          <View style={styles.inputField}>
            <Ionicons name="person" size={24} color="gray" style={{ marginLeft: 8 }} />
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.inputText}
              placeholder="Adınızı giriniz"
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
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

        <View style={{ marginTop: 20 }}>
          <View style={styles.inputField}>
            <MaterialIcons style={{ marginLeft: 2 }} name="email" size={24} color="gray" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.inputText}
              placeholder="Email adresinizi giriniz"
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
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
