import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { db } from "../../firebaseConfig";

export default function Cadastrar() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [idade, setIdade] = useState("");
  const [genero, setGenero] = useState("");
  const [diretor, setDiretor] = useState("");

  async function salvar() {
    if (nome.trim() === "" || ano.trim() === "" || idade.trim() === "" ||
        genero.trim() === "" || diretor.trim() === "") {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      await addDoc(collection(db, "filmes"), {
        nome: nome.trim(),
        ano: ano.trim(),
        idade: idade.trim(),
        genero: genero.trim(),
        diretor: diretor.trim(),
      });
      Alert.alert("Sucesso", "Filme cadastrado.");
      router.back();
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível cadastrar o filme. " + String(erro));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastrar filme</Text>

      <Text style={styles.label}>Nome do filme:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome}/>

      <Text style={styles.label}>Ano de lançamento:</Text>
      <TextInput style={styles.input} value={ano} onChangeText={setAno}/>

      <Text style={styles.label}>Idade indicativa:</Text>
      <TextInput style={styles.input} value={idade} onChangeText={setIdade}/>

      <Text style={styles.label}>Gênero:</Text>
      <TextInput style={styles.input} value={genero} onChangeText={setGenero}/>

      <Text style={styles.label}>Diretor:</Text>
      <TextInput style={styles.input} value={diretor} onChangeText={setDiretor}/>

      <Pressable style={styles.botao} onPress={salvar}>
        <Text style={styles.textoBotao}>Salvar filme</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 8 },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 6, padding: 12, backgroundColor: "#fff" },
  botao: { backgroundColor: "#15803d", padding: 14, borderRadius: 6, alignItems: "center", marginTop: 18 },
  textoBotao: { color: "#fff", fontWeight: "bold" },
});
