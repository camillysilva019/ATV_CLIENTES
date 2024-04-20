import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, SafeAreaView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, StackActions } from '@react-navigation/native'

const db = new DatabaseConnection.getConnection;

export default function App() {
    const navigation = useNavigation();
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tbl_clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, data_nasc DATE)",
                [], 
                () => console.log('Tabela de clientes criada com sucesso'),
                (_, error) => console.error(error)
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS telefone_has_clientes (telefone_id INTEGER PRIMARY KEY AUTOINCREMENT, cliente_id INT NOT NULL, FOREIGN KEY (cliente_id) REFERENCES tbl_clientes(id))",
                [], 
                () => console.log('Tabela de relacionamento criada com sucesso'),
                (_, error) => console.error(error)
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tbl_telefone (id INTEGER PRIMARY KEY AUTOINCREMENT, numero VARCHAR(11) NOT NULL, tipo VARCHAR(20), cliente_id INT NOT NULL, FOREIGN KEY (cliente_id) REFERENCES tbl_clientes(id))",
                [], 
                () => console.log('Tabela de telefones criada com sucesso'),
                (_, error) => console.error(error)
            );
        });
    }, []);

    const goToClientes = () => {
        navigation.navigate('AllClients');
    };

    const goToConfiguracoes = () => {
        navigation.navigate('ClientConfig');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.androidSafeArea}>
                <View style={styles.container}>

                    <Image
                        source={require('../../../assets/icon.png')}
                        style={{ width: 300, height: 300 }}
                    />

                    <Text style={styles.title}>Cadastro de Clientes</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={goToClientes}
                    >
                        <Text style={styles.textButton}>Acessar Clientes</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.alinharEmLinha}>
                    <TouchableOpacity style={styles.buttonConfig} onPress={goToConfiguracoes}>
                        <FontAwesome6 name='gear' color='#6B8EDA' size={24} />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        marginTop: 10,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
        padding: 15,
        gap: 10
    },
    alinharEmLinha: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 15,
    },
    buttonConfig: {

    },
    button: {
        borderRadius: 10,
        backgroundColor: "black",
        height: 60,
        width: '90%',
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        elevation: 7,
        marginBottom: 30
    },
    textButton: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 26,
        letterSpacing: 6,
        textAlign: 'center',
        color: 'black'
    },
    buttonTable: {
        flexDirection: 'row',
        gap: 15
    }
});