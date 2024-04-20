import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useRoute } from '@react-navigation/native'

const db = new DatabaseConnection.getConnection;

export default function Config() {
  const navigation = useNavigation();

  const deleteDatabase = () => {
    console.log('sadasda')
    db.transaction(
      tx => {
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
          [],
          (_, { rows }) => {
            console.log('Tabelas encontradas:', rows._array);
            rows._array.forEach(table => {
              console.log('Excluindo tabela:', table.name);
              tx.executeSql(
                `DROP TABLE IF EXISTS ${table.name}`,
                [],
                () => {
                  console.log(`Tabela ${table.name} excluída com sucesso`);
                },
                (_, error) => {
                  console.error(`Erro ao excluir a tabela ${table.name}:`, error);
                  Alert.alert('Erro', `Ocorreu um erro ao excluir a tabela ${table.name}.`);
                }
              );
            });
          },
          (_, error) => {
            console.error('Erro ao buscar as tabelas:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao buscar as tabelas.');
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
            <Text style={styles.title}>Configurações do Sistema</Text>
          </View>

          <View style={styles.viewSection}>
            <Text style={styles.titleSection}>Sobre o sistema: </Text>
            <Text>Sistema destinado ao gerenciamento de clientes e suas informações.</Text>
            <Text style={styles.titleSection}>Versão do sistema: </Text>
            <Text>v1.0.0</Text>
          </View>

          <View style={styles.viewSection}>
            <Text style={styles.titleSection}>Reset do banco de dados: </Text>
            <Text>Esta funcionalidade realiza a exclusão de todo o banco de dados. Ao executar esta ação, todos os registros serão apagados permanentemente.</Text>
            <TouchableOpacity
              style={styles.buttonSalvar}
              onPress={() => {
                Alert.alert(
                  "Atenção!",
                  'Deseja excluir o banco de dados? Todos os registros serão perdidos. Esta ação não pode ser desfeita!',
                  [
                    {
                      text: 'OK',
                      onPress: () => deleteDatabase()
                    },
                    {
                      text: 'Cancelar',
                      onPress: () => { return }
                    }
                  ],
                )

              }}
            >
              <Text style={styles.buttonTitle}>Excluir banco de dados</Text>
              <FontAwesome6 name='check' size={32} color="#FFF" />
            </TouchableOpacity>
          </View>

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
  },
  container: {
    width: '95%',
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
  titleSection: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold'
  },
  viewSection: {
    gap: 10,
    marginBottom: 15
  },
  buttonSalvar: {
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: "#3d85c6",
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
