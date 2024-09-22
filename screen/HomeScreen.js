import { StyleSheet, Text, View, SafeAreaView, Platform, ScrollView, Pressable, TextInput, Image, StatusBar } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { UserContext } from '../context/UserContext';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Arama sorgusu
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(json => setProducts(json))
      .catch(err => console.error(err));
  }, []);

  const filteredProducts = products
    .filter(product =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter(product => {
      const search = searchQuery.toLowerCase();
      const price = product.price.toString();
      return (
        product.title.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        price.includes(search) // Ürün fiyatında da arama yap
      );
    });

  const isSelectedCategory = (category) => selectedCategory === category;

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "#F6F6F6"
      }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <StatusBar backgroundColor="transparent" translucent={true} barStyle="dark-content" />

          {/* Arama Bölümü */}
          <View style={styles.searchSection}>
            <Pressable style={styles.searchBar}>
              <AntDesign style={styles.searchIcon} name="search1" size={24} color="gray" />
              <TextInput
                placeholder="Ürün veya fiyat ara..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </Pressable>
          </View>

          <View style={styles.addressSection}>
            <Pressable
              onPress={() => navigation.navigate('AddressScreen')}
              style={styles.addressPressable}
            >
              <Ionicons style={styles.locationIcon} name="location-outline" size={24} color="black" />
              <Text style={styles.addressText}>
                {user?.address ? `${user.address.city}, ${user.address.street}` : "Adres bilgisi mevcut değil"}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </Pressable>
          </View>

          {/* Kategoriler */}
          <View style={styles.categories}>
            <Pressable
              onPress={() => setSelectedCategory(selectedCategory === "jewelery" ? null : "jewelery")}
              style={[
                styles.categoriItem,
                isSelectedCategory("jewelery") && styles.selectedCategory // Seçili kategoriye vurgu yap
              ]}
            >
              <Image source={require('../pictures/jewelery.png')} style={styles.categoriIcon} />
              <Text style={[styles.categoryText, isSelectedCategory("jewelery") && styles.selectedCategoryText]}>Mücevher</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedCategory(selectedCategory === "men's clothing" ? null : "men's clothing")}
              style={[
                styles.categoriItem,
                isSelectedCategory("men's clothing") && styles.selectedCategory
              ]}
            >
              <Image source={require('../pictures/clothes.png')} style={styles.categoriIcon} />
              <Text style={[styles.categoryText, isSelectedCategory("men's clothing") && styles.selectedCategoryText]}>Erkek Giyim</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedCategory(selectedCategory === "electronics" ? null : "electronics")}
              style={[
                styles.categoriItem,
                isSelectedCategory("electronics") && styles.selectedCategory
              ]}
            >
              <Image source={require('../pictures/mobile-phone.png')} style={styles.categoriIcon} />
              <Text style={[styles.categoryText, isSelectedCategory("electronics") && styles.selectedCategoryText]}>Elektronik</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedCategory(selectedCategory === "women's clothing" ? null : "women's clothing")}
              style={[
                styles.categoriItem,
                isSelectedCategory("women's clothing") && styles.selectedCategory
              ]}
            >
              <Image source={require('../pictures/dress.png')} style={styles.categoriIcon} />
              <Text style={[styles.categoryText, isSelectedCategory("women's clothing") && styles.selectedCategoryText]}>Kadın Giyim</Text>
            </Pressable>
          </View>

          <View style={styles.campaignSection}>
            <Image
              source={require('../pictures/commerce.png')}
              style={styles.campainPicture} />
          </View>

          {/* Tüm Ürünler */}
          <View style={styles.trendsSection}>
            <Text style={styles.sectionTitle}>Tüm Ürünler</Text>
            <View style={styles.AllItems}>
              {filteredProducts.map((product) => (
                <Pressable
                  key={product.id}
                  style={styles.AllItem}
                  onPress={() => navigation.navigate('Product', { product })}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productTitle}>{product.title}</Text>
                  <Text style={styles.productPrice}>₺{product.price}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;


const styles = StyleSheet.create({
  searchSection: {
    backgroundColor: "#5EC4CF",
    padding: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  addressSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7EE6F1",
    padding: 15,
  },
  addressPressable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    marginRight: 10,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  categories: {
    flexDirection: "row",
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'white',
    flexWrap: 'wrap',
  },
  categoriItem: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#189BCC',
    backgroundColor: '#E0F7FA',
  },
  categoriIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: '#189BCC',
    fontWeight: "bold",
  },
  campaignSection: {
    padding: 10,
  },
  campainPicture: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  trendsSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
  },
  AllItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  AllItem: {
    backgroundColor: 'white',
    width: '48%',
    height: 250,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10
  },
  productTitle: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 5,
    textAlign: 'center',
    color: '#333',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  productPrice: {
    fontWeight: 'bold',
    alignItems: 'center',
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  priceFilterSection: {
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  priceInput: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
});
