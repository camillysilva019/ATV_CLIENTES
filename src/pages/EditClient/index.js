
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useRoute } from '@react-navigation/native'

const db = new DatabaseConnection.getConnection;

export default function EditClient() {
  const route = useRoute();
  const navigation = useNavigation();

  const [id, setId] = useState(route.params?.id)
  const [cliente, setCliente] = useState(route.params?.cliente);
  const [telefone, setTelefone] = useState(route.params?.telefone);
  const [dataNascimento, setDataNascimento] = useState(route.params?.dataNascimento);


  const salvarRegistro = () => {
    if (cliente.trim() === '') {
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
          'UPDATE clientes SET nome=?, telefone=?, data_nasc=? WHERE id=?',
          [cliente, telefone, dataNascimento, id],
          (_, { rowsAffected }) => {
            console.log(rowsAffected);
            setCliente('');
            setTelefone('');
            setDataNascimento('');
            Alert.alert('Info', 'Registro alterado com sucesso',
              [
                {
                  onPress: () => {
                    navigation.navigate('AllClientes');
                  }
                }]);
          },
          (_, error) => {
            console.error('Erro ao editar o registro:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao editar o registro.');
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
            <Text style={styles.title}>Editar registro</Text>
          </View>

          <TextInput
            style={styles.input}
            value={cliente}
            onChangeText={setCliente}
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
