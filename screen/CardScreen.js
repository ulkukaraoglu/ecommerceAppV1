import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, StatusBar, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';
import PaymentModal from '../modals/PaymentModals';
import { AntDesign } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';


const CartScreen = () => {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const fetchPaymentSheetParams = async () => {
        const response = await fetch('http://192.168.1.105:4242/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: 500 }),
        });
        const data = await response.json();
        console.log(data);
        const { paymentIntent } = data;
        return {
            paymentIntent,
        };
    };

    const openPaymentSheet = async () => {
        setLoading(true);

        const { paymentIntent } = await fetchPaymentSheetParams();
        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: paymentIntent,
        });

        if (!error) {
            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                Alert.alert(`Error: ${presentError.message}`)
            } else {
                Alert.alert('Ödeme başarılı')
            }
        } else {
            Alert.alert(`Error: ${error.message}`)
        }
        setLoading(false);
    }

    useEffect(() => {
        const fetchCartItems = async () => {
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

    const updateQuantity = (productId, amount) => {
        const updatedItems = cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: item.quantity + amount }
                : item
        );

        const updatedCart = updatedItems.filter(item => item.quantity > 0);
        setCartItems(updatedCart);
    };

    const removeItemFromCart = (productId) => {
        Alert.alert(
            'Ürünü sil',
            'Bu ürünü sepetten silmek istediğinizden emin misiniz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel',
                },
                {
                    text: 'Sil',
                    onPress: () => {
                        const updatedItems = cartItems.filter(item => item.id !== productId);
                        setCartItems(updatedItems);
                    },
                    style: 'destructive',
                },
            ]
        );
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
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sepetim</Text>
            </View>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Sepetiniz boş.</Text>}
            />

            {/* Toplam Fiyat */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Toplam: ${calculateTotal().toFixed(2)}</Text>
            </View>

            {/* Satın Al Butonu */}
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
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>

                        {/* Kapat İkonu */}
                        <TouchableOpacity
                            style={styles.closeIconContainer}
                            onPress={() => setModalVisible(false)}
                        >
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>

                        {/* Kredi/Banka Kartı Butonu */}
                        <TouchableOpacity style={styles.optionButton}>
                            <Text style={styles.buttonText}>Kredi/Banka Kartı</Text>
                            <AntDesign name="right" size={24} color="black" />
                        </TouchableOpacity>

                        {/* Kapıda Ödeme Butonu */}
                        <TouchableOpacity style={styles.optionButton}>
                            <Text style={styles.buttonText}>Kapıda Ödeme</Text>
                            <AntDesign name="right" size={24} color="black" />
                        </TouchableOpacity>

                    </View>
                </View>
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
    separator: {
        height: 1,
        backgroundColor: '#EAEAEA',
        marginVertical: 16,
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
    header: {
        height: 60,
        backgroundColor: '#5EC4CF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        borderRadius: 5,
    },
    headerTitle: {
        fontSize: 20.5,
        fontWeight: 'bold',
        color: '#FFFF'
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
        position: 'relative',
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
