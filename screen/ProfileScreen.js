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
        fetch('https://fakestoreapi.com/carts?startdate=2019-12-10&enddate=2024-10-10')
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
        <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate('PastOrdersScreen', { orderId: item.id })}>
            <Text style={styles.orderText}>Sipariş No: {item.id}</Text>
            <Text style={styles.orderText}>Tarih: {new Date(item.date).toLocaleDateString()}</Text>
            {item.products.map(product => (
                <View key={product.productId} style={styles.productContainer}>
                    {products[product.productId] ? (
                        <>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Product', { product: products[product.productId] })}>
                                <Text style={styles.productName}>Ürün: {products[product.productId].title}</Text>
                                <Image
                                    source={{ uri: products[product.productId].image }}
                                    style={styles.productImage}
                                />
                            </TouchableOpacity>
                            <Text>Adet: {product.quantity}</Text>
                            <Text>Fiyat: ${products[product.productId].price}</Text>
                        </>
                    ) : (
                        <Text>Ürün bilgisi yükleniyor...</Text>
                    )}
                </View>
            ))}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("UserSettingScreen")}
                >
                    <Text style={styles.buttonText}>Hesabınız</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Siparişleriniz</Text>
            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Henüz siparişiniz bulunmamaktadır.</Text>}
                contentContainerStyle={styles.ordersContainer}
            />
        </SafeAreaView>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F0F4F8',
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
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: '45%',
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#DC3545',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    ordersContainer: {
        alignItems: 'center',
        flexGrow: 1,
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
        height: 60,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
        fontSize: 16,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    // buttonText: {
    //     fontSize: 18,
    //     fontFamily: 'Gill Sans',
    //     textAlign: 'center',
    //     margin: 10,
    //     color: '#ffffff',
    //     backgroundColor: 'transparent',
    // },
});
