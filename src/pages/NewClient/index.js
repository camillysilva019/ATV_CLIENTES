import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import RNPickerSelect from 'react-native-picker-select';

const db = new DatabaseConnection.getConnection;

export default function NewItem() {
    const [nomeCliente, setNomeCliente] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    const salvarRegistro = () => {
        if (nomeCliente.trim() === '') {
            Alert.alert('Erro', 'O nome do cliente deve ser preenchido');
            return;
        }
        if (telefone.trim() === '') {
            Alert.alert('Erro', 'O telefone do cliente deve ser preenchido');
            return;
        }
        if (dataNascimento.trim() === '') {
            Alert.alert('Erro', 'A data de nascimento do cliente deve ser preenchida');
            return;
        }

        db.transaction(
            tx => {
                tx.executeSql(
                    'INSERT INTO tbl_clientes (nome, data_nasc) VALUES (?,?)',
                    [nomeCliente, dataNascimento],
                    (_, { insertId }) => {
                        tx.executeSql(
                            'INSERT INTO tbl_telefone (numero, cliente_id) VALUES (?, ?)',
                            [telefone, insertId],
                            () => {
                                console.log('Registro de cliente inserido com sucesso');
                                setNomeCliente('');
                                setTelefone('');
                                setDataNascimento('');
                                Alert.alert('Info', 'Registro incluído com sucesso');
                            },
                            (_, error) => {
                                console.error('Erro ao adicionar telefone do cliente:', error);
                                Alert.alert('Erro', 'Ocorreu um erro ao adicionar o telefone do cliente.');
                            }
                        );
                    },
                    (_, error) => {
                        console.error('Erro ao adicionar cliente:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao adicionar o cliente.');
                    }
                );
            }
        );

    };



    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.androidSafeArea}>
                <View style={styles.container}>

                    <View style={styles.viewTitle}>
                        <Text style={styles.title}>Novo registro</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        value={nomeCliente}
                        onChangeText={setNomeCliente}
                        placeholder="Informe o nome do cliente"
                    />
                    <TextInput
                        style={styles.input}
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="Informe o telefone do cliente"
                    />
                    <TextInput
                        style={styles.input}
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                        placeholder="Informe a data de nascimento do cliente"
                    />

                    <TouchableOpacity
                        style={styles.buttonSalvar}
                        onPress={salvarRegistro}
                    >
                        <Text style={styles.buttonTitle}>Salvar</Text>
                        <FontAwesome6 name='check' size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>


            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        marginTop: 10
    },
    container: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 15,
        gap: 10,
        borderRadius: 10,
        elevation: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    viewTitle: {
        alignItems: 'center',
        alignContent: 'center',
        width: '100%'
    },
    clienteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    dropDown: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonSalvar: {
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: "#7a42f4",
        borderRadius: 8,
        elevation: 5,
        shadowOpacity: 1,
        shadowColor: 'black',
        shadowRadius: 5,
        gap: 10,
        padding: 10,
    },
    buttonTitle: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold"
    },
    
});
