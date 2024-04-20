import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, SafeAreaView, Platform, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, StackActions, useRoute, useFocusEffect } from '@react-navigation/native'

const db = new DatabaseConnection.getConnection;
const windowWidth = Dimensions.get('window').width;

export default function AllClients() {
    const route = useRoute();

    const [clientes, setClientes] = useState([]);
    const [textPesquisa, setTextPesquisa] = useState('');
    const [refresh, setRefresh] = useState(route.params?.refresh ? route.params.setRefresh : false);

    const navigation = useNavigation();

    const newClient = () => {
        navigation.navigate('NewClient');
    }

    useFocusEffect(
        useCallback(() => {
            if (clientes.length !== 0) {
                filterRecords();
            }
        }, [refresh])
    )

    const fetchRecords = () => {
        try {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM clientes', [], (_, { rows }) =>
                    setClientes(rows._array)
                );
            });
        } catch (error) {
            console.error('Erro ao buscar todos:', error);
        }
    };

    const filterRecords = () => {
        try {
            db.transaction(tx => {
                tx.executeSql("SELECT * FROM clientes WHERE nome LIKE ? OR telefone LIKE ?",
                    [`%${textPesquisa}%`, `%${textPesquisa}%`],
                    (_, { rows }) =>
                        setClientes(rows._array)
                );
            });
        } catch (error) {
            console.error('Erro ao filtrar registros:', error);
        }
    };

    useEffect(() => {
        filterRecords();
    }, [textPesquisa]);

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleEditClient = (cliente) => {
        navigation.navigate('EditClient', cliente);
    };

    const handleDeleteClient = (id) => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'DELETE FROM clientes WHERE id = ?',
                    [id], 
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            fetchRecords();
                            Alert.alert('Sucesso', 'Cliente excluído com sucesso.');
                        } else {
                            Alert.alert('Erro', 'Nenhum cliente foi excluído, verifique e tente novamente!');
                        }
                    },
                    (_, error) => {
                        console.error('Erro ao excluir cliente:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao excluir o cliente.');
                    }
                );
            }
        );
    };

    return (
        <SafeAreaView style={styles.androidSafeArea}>
            <View>
                <Text style={styles.title}>Clientes Cadastrados</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingBottom: 10 }}>
                <TextInput
                    onChangeText={setTextPesquisa}
                    value={textPesquisa}
                    style={styles.inputSearch}
                    placeholder='Para pesquisar, informe o nome ou telefone do cliente'
                />
            </View>

            <ScrollView contentContainerStyle={styles.containerScroll}>
                {clientes.map(cliente => (
                    <View key={cliente.id} style={[styles.containerClientes]}>
                        <View style={styles.clienteItem}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{cliente.nome}</Text>
                            <Text>{cliente.telefone}</Text>
                            <View style={styles.viewButtonTable}>
                                <TouchableOpacity
                                    style={[styles.alinharEmLinha]}
                                    onPress={() => {
                                        Alert.alert(
                                            "Atenção!",
                                            'Deseja excluir o cliente selecionado?',
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () => handleDeleteClient(cliente.id)
                                                },
                                                {
                                                    text: 'Cancelar',
                                                    onPress: () => { return },
                                                    style: 'cancel',
                                                }
                                            ],
                                        )
                                    }}>
                                    <FontAwesome6 name='trash-can' color={'#f5554a'} size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.alinharEmLinha]}
                                    onPress={() => handleEditClient(cliente)}
                                >
                                    <FontAwesome6 name='pen-to-square' color={'#114264'} size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20, position: 'relative', elevation: 5 }}>
                <TouchableOpacity
                    style={[styles.alinharEmLinha, styles.buttonNovoCliente]}
                    onPress={newClient}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#FFF' }}>Novo cliente</Text>
                    <FontAwesome6 name='plus' color={'#FFF'} size={24} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        marginTop: 10
    },
    alinharEmLinha: {
        flexDirection: 'row',
        alignContent: "flex-start",
        alignItems: 'center'
    },
    containerClientes: {
        width: '90%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        gap: 10,
        borderRadius: 10,
        elevation: 5,
        marginTop: 5
    },
    containerScroll: {
        flexGrow: 1,
        width: windowWidth,
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 20,
        gap: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    clienteItem: {
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 5
    },
    viewButtonTable: {
        width: '100%',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'flex-end',
        marginBottom: -5,
    },
    buttonNovoCliente: {
        backgroundColor: '#6397c6',
        borderRadius: 8,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 50,
        gap: 15,
        elevation: 3
    },
    inputSearch: {
        width: '90%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 5,
        borderRadius: 5,
        backgroundColor: "#fafafa",
        fontSize: 16,
        color: "#333",
        textAlign: 'center'
    },
});



