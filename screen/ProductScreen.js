import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

function ProductScreen({ route }) {
    const { product, userId } = route.params;
    const navigation = useNavigation();


    const [quantity, setQuantity] = useState(1);

    const addToCart = () => {
        fetch('https://fakestoreapi.com/carts', {
            method: "POST",
            body: JSON.stringify({
                userId: userId,
                date: new Date().toISOString().split('T')[0],
                products: [{ productId: product.id, quantity: quantity }]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                Alert.alert(
                    "Başarılı",
                    "Ürün sepete eklendi!",
                    [
                        {
                            text: "Tamam",
                            onPress: () => navigation.navigate('Card') // "Tamam" butonuna basılınca yönlendirme
                        }
                    ]
                );
            })
            .catch(error => {
                console.error(error);
                Alert.alert("Hata", "Ürün sepete eklenirken bir hata oluştu.");
            });
    };


    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };


    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                />
                <Text style={styles.description}>
                    {product.description}
                </Text>

                <View style={styles.priceAndQuantityContainer}>
                    <Text style={styles.price}>
                        ${product.price.toFixed(2)}
                    </Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={addToCart}>
                    <Text style={styles.buttonText}>Sepete Ekle</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    productImage: {
        width: '100%',
        height: 350,
        resizeMode: 'contain',
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    description: {
        fontFamily: 'Roboto',
        marginVertical: 16,
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        textAlign: 'justify',
    },
    priceAndQuantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 5,
    },
    quantityButton: {
        backgroundColor: '#FF9800',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    quantityButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});
