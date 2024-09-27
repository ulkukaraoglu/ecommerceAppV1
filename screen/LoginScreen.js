import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, Pressable, Alert, ScrollView, ActivityIndicator, Platform, StatusBar } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from '../context/UserContext';
import { SafeAreaView } from "react-native-safe-area-context";


const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                const user = await AsyncStorage.getItem("user");

                if (token && user) {
                    navigation.navigate("MainScreen", { user: JSON.parse(user) });
                }
            } catch (err) {
                console.log("Hata Mesajı", err);
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    // Login ekranına geri dönüldüğünde inputları sıfırla
    useFocusEffect(
        React.useCallback(() => {
            setUsername("");
            setPassword("");
        }, [])
    );

    const handleLogin = () => {
        fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(res => res.json())
            .then(async (json) => {
                if (json.token) {
                    const token = json.token;

                    // Tüm kullanıcıları arasında giriş yapan kullanıcının bilgilerini bulup girişi onaylıyoruz
                    fetch('https://fakestoreapi.com/users', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => res.json())
                        .then(async (users) => {
                            const loggedInUser = users.find(user => user.username === username);

                            if (loggedInUser) {
                                const user = {
                                    ...loggedInUser,
                                    token: token
                                };

                                console.log("Giriş Yapan Kullanıcı Bilgileri:", user);

                                await AsyncStorage.setItem("authToken", token);
                                await AsyncStorage.setItem("user", JSON.stringify(user));

                                setUser(user);

                                setUsername("");
                                setPassword("");

                                navigation.replace("MainScreen", { token: token, user });

                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'MainScreen', params: { token: token, user } }]
                                });
                            } else {
                                Alert.alert("Hata", "Giriş yapan kullanıcı bulunamadı.");
                            }
                        })
                        .catch(err => {
                            console.error("Kullanıcıları alırken hata oluştu:", err);
                            Alert.alert("Hata", "Kullanıcı bilgileri alınamadı.");
                        });
                } else {
                    Alert.alert("Giriş Hatası", "Kullanıcı adı veya şifre yanlış");
                }
            })
            .catch(error => {
                Alert.alert("Hata", "Bir sorun oluştu.");
                console.log(error);
            });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ backgroundColor: "white" }}>
                    <View>
                        <Image source={require("../pictures/logo.png")} style={styles.logo} />
                    </View>

                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 0, color: "#041E42" }}>
                            Hesabınıza Giriş Yapınız
                        </Text>
                    </View>

                    <View style={{ marginTop: 35 }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            backgroundColor: "#D0D0D0",
                            paddingVertical: 5,
                            borderRadius: 5,
                            marginTop: 30
                        }}>
                            <MaterialIcons style={{ marginLeft: 8 }} name="person" size={24} color="gray" />
                            <TextInput
                                value={username}
                                onChangeText={(text) => setUsername(text)}
                                style={{ color: "gray", marginVertical: 10, width: 300, fontSize: username ? 16 : 16 }}
                                placeholder="Kullanıcı adınızı giriniz"
                            />
                        </View>
                    </View>

                    <View>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            backgroundColor: "#D0D0D0",
                            paddingVertical: 5,
                            borderRadius: 5,
                            marginTop: 5
                        }}>
                            <AntDesign name="lock" size={24} color="gray" />
                            <TextInput
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={true}
                                style={{ color: "gray", marginVertical: 10, width: 300, fontSize: password ? 16 : 16 }}
                                placeholder="Şifrenizi giriniz"
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 50 }} />

                    <Pressable onPress={handleLogin} style={styles.button}>
                        <Text style={styles.buttonText}>Giriş Yap</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 15 }}>
                        <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>Hesabınız yok mu? Kaydol</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    logo: {
        width: 270,
        height: 250,
        right:-49,
        resizeMode: 'contain',
    },
    button: {
        width: 200,
        backgroundColor: "#FEBE10",
        borderRadius: 12,
        marginLeft: "auto",
        marginRight: "auto",
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    safeArea: {
        paddingTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "white",
    },
});
