import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

function PastOrdersScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [products, setProducts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/carts/${orderId}`)
      .then(res => res.json())
      .then(async (order) => {
        setOrderDetails(order);

        let priceSum = 0; // Toplam fiyatı tutacak değişken
        await Promise.all(
          order.products.map(async (product) => {
            if (!products[product.productId]) {
              const res = await fetch(`https://fakestoreapi.com/products/${product.productId}`);
              const productDetails = await res.json();
              priceSum += productDetails.price * product.quantity;
              setProducts(prevProducts => ({
                ...prevProducts,
                [product.productId]: productDetails,
              }));
            }
          })
        );

        setTotalPrice(priceSum);
      })
      .catch(error => console.error("Sipariş Detaylarını Çekme Hatası:", error));
  }, [orderId]);

  if (!orderDetails) {
    return <Text style={styles.loadingText}>Yükleniyor...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sipariş No: {orderDetails.id}</Text>
      <Text style={styles.dateText}>Sipariş Tarihi: {new Date(orderDetails.date).toLocaleDateString()}</Text>
      <Text style={styles.totalPriceText}>Toplam Ücret: ${totalPrice.toFixed(2)}</Text>
      <Text style={styles.sectionTitle}>Ürünler</Text>

      <FlatList
        data={orderDetails.products}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            {products[item.productId] ? (
              <TouchableOpacity
                style={styles.productTouchable}
                onPress={() => navigation.navigate('Product', { product: products[item.productId] })}
              >
                <Image
                  source={{ uri: products[item.productId].image }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{products[item.productId].title}</Text>
                  <Text style={styles.productQuantity}>Adet: {item.quantity}</Text>
                  <Text style={styles.productPrice}>Fiyat: ${products[item.productId].price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.loadingText}>Ürün bilgisi yükleniyor...</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

export default PastOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  dateText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  totalPriceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#009688',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  productContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  productTouchable: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  productQuantity: {
    fontSize: 14,
    color: '#555',
  },
  productPrice: {
    fontSize: 14,
    color: '#009688',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  productImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});
