import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        fetch('https://fakestoreapi.com/carts?startdate=2019-12-10&enddate=2020-10-10')
            .then(res => res.json())
            .then(json => {
                setOrders(json);
                json.forEach(order => {
                    order.products.forEach(async (product) => {
                        if (!products[product.productId]) {
                            const res = await fetch(`https://fakestoreapi.com/products/${product.productId}`);
                            const productDetails = await res.json();
                            setProducts(prevProducts => ({
                                ...prevProducts,
                                [product.productId]: productDetails,
                            }));
                        }
                    });
                });
            })
            .catch(error => console.error("Siparişleri Çekme Hatası:", error));
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert("Çıkış Hatası", "Çıkış yaparken bir sorun oluştu.");
            console.log("Logout Error:", error);
        }
    };

    const renderOrder = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.orderText}>Sipariş ID: {item.id}</Text>
            <Text style={styles.orderText}>Tarih: {new Date(item.date).toLocaleDateString()}</Text>
            {item.products.map(product => (
                <View key={product.productId} style={styles.productContainer}>
                    {products[product.productId] ? (
                        <>
                            <Text style={styles.productName}>Ürün: {products[product.productId].title}</Text>
                            <Image
                                source={{ uri: products[product.productId].image }}
                                style={styles.productImage}
                            />
                            <Text>Adet: {product.quantity}</Text>
                            <Text>Fiyat: ${products[product.productId].price}</Text>
                        </>
                    ) : (
                        <Text>Ürün bilgisi yükleniyor...</Text>
                    )}
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Hoşgeldiniz, Ad-Soyad</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button} onPress={() => navigation.navigate("UserSettingScreen")} >
                    <Text style={styles.buttonText}>Hesabınız</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Siparişleriniz</Text>
            <View style={styles.ordersContainer}>
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={<Text style={styles.emptyText}>Henüz siparişiniz bulunmamaktadır.</Text>}
                />
            </View>
        </SafeAreaView>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9F9F9',
    },
    header: {
        backgroundColor: '#4B9CD3',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FFC107',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '45%',
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#DC3545',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    ordersContainer: {
        alignItems: 'center',
        flex: 1,
    },
    orderItem: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginVertical: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '100%',
    },
    orderText: {
        fontSize: 16,
        color: '#333',
    },
    productContainer: {
        marginVertical: 5,
    },
    productName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
        fontSize: 16,
    },
});
