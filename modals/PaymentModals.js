import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const PaymentModal = ({ modalVisible, setModalVisible, switchToCartPaymentModal }) => {
    return (
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
                    <TouchableOpacity style={styles.optionButton} onPress={switchToCartPaymentModal}>
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
    );
};

const styles = StyleSheet.create({
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

export default PaymentModal;
