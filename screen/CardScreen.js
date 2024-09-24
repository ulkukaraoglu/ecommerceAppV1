import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';
import { AntDesign } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://fakestoreapi.com/carts/user/${user.id}`);
                const data = await response.json();
                const products = data[0]?.products || [];
                const detailedProducts = await Promise.all(
                    products.map(async (product) => {
                        const productResponse = await fetch(`https://fakestoreapi.com/products/${product.productId}`);
                        const productData = await productResponse.json();
                        return {
                            ...productData,
                            quantity: product.quantity,
                        };
                    })
                );
                setCartItems(detailedProducts);
            } catch (error) {
                console.error('Sepet ürünleri alınırken hata oluştu:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchCartItems();
        }
    }, [user]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch('http://192.168.1.47:4242/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: calculateTotal() * 100 }),
            });

            const data = await response.json();
            if (!data.clientSecret) {
                throw new Error("Client secret yok.");
            }
            return { clientSecret: data.clientSecret };
        } catch (error) {
            console.error("fetchPaymentSheetParams Hatası:", error);
            Alert.alert("Hata", "Ödeme süreci başlatılamadı.");
            throw error;
        }
    };

    const initializePaymentSheet = async () => {
        try {
            setLoading(true);
            const { clientSecret } = await fetchPaymentSheetParams();
            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Your Store Name',
                countryCode: 'US', //  ülke kodu
                googlePay: false, // Google Pay destekleniyorsa
                applePay: false,  //  Apple Pay destekleniyorsa
            });

            if (error) {
                console.error("initPaymentSheet Error: ", error);
                Alert.alert("Hata", "PaymentSheet başlatılamadı: " + error.message);
            } else {
                console.log("PaymentSheet başarıyla başlatıldı");
                setLoading(false);
            }
        } catch (error) {
            console.error("initializePaymentSheet Hatası:", error);
            Alert.alert("Hata", "Ödeme süreci başlatılamadı.");
        } finally {
            setLoading(false);
        }
    };

    const openPaymentSheet = async () => {
        try {
            setLoading(true);
            const { error } = await presentPaymentSheet();

            if (error) {
                console.error("presentPaymentSheet Error: ", error);
                Alert.alert(`Hata`, error.message);
            } else {
                Alert.alert('Başarılı', 'Ödeme işlemi başarılı.');
                navigation.navigate("MainScreen")
            }
        } catch (error) {
            console.error("openPaymentSheet Hatası:", error);
            Alert.alert("Hata", "Ödeme ekranı açılamadı.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentOption = async (option) => {
        setModalVisible(false);

        if (option === 'online') {
            await initializePaymentSheet(); // PaymentSheet başlatılıyor
            openPaymentSheet(); // Başlatıldıktan sonra ödeme ekranı açılıyor
        }
    };

    // Ürün sayısını artırma/azaltma fonksiyonu
    const updateQuantity = (productId, change) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity + change }
                        : item
                )
                .filter((item) => item.quantity > 0) 
        );
    };

    // Ürünü sepetten silme fonksiyonu
    const removeItemFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const renderItem = ({ item }) => (
        <View style={styles.productContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.title}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.controlsContainer}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.controlButton}>
                    <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.controlButton}>
                    <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeItemFromCart(item.id)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Sil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Sepetiniz boş.</Text>}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Toplam: ${calculateTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.purchaseButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.purchaseButtonText}>Satın Al</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity style={styles.closeIconContainer} onPress={() => setModalVisible(false)}>
                                    <AntDesign name="close" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionButton} onPress={() => handlePaymentOption('online')}>
                                    <Text style={styles.buttonText}>Kredi/Banka Kartı</Text>
                                    <AntDesign name="right" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productContainer: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    productInfo: {
        marginLeft: 16,
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButton: {
        backgroundColor: '#007BFF',
        padding: 8,
        borderRadius: 4,
    },
    controlButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    quantityText: {
        marginHorizontal: 12,
        fontSize: 16,
    },
    removeButton: {
        backgroundColor: '#FF6347',
        padding: 8,
        borderRadius: 4,
        marginLeft: 10,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    totalContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    purchaseButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    purchaseButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    modalContainer: {
        width: 350,
        padding: 55,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontSize: 16,
        color: 'black',
    },
});
