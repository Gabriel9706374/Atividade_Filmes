import { useFocusEffect, useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "../../firebaseConfig";

type Filme = {
  id: string;
  nome: string;
  ano: string;
  idade: string;
  genero: string;
  diretor: string;
};

export default function Index() {
  const router = useRouter();
  const [filmes, setFilmes] = useState<Filme[]>([]);

  async function consultarFilmes() {
    try {
      const consulta = await getDocs(collection(db, "filmes"));
      const lista: Filme[] = consulta.docs.map((documento) => ({
        id: documento.id,
        nome: documento.data().nome,
        ano: documento.data().ano,
        idade: documento.data().idade,
        genero: documento.data().genero,
        diretor: documento.data().diretor,
      }));
      setFilmes(lista);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível consultar os filmes. " + String(erro));
    }
  }

  useFocusEffect(
    useCallback(() => {
      consultarFilmes();
    }, [])
  );

  async function excluirFilme(id: string) {
    try {
      await deleteDoc(doc(db, "filmes", id));
      setFilmes((lista) => lista.filter((filme) => filme.id !== id));
      Alert.alert("Sucesso", "Filme excluído.");
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível excluir o filme. " + String(erro));
    }
  }

  function confirmarExclusao(id: string, nome: string) {
    Alert.alert("Excluir filme", 'Deseja excluir "' + nome + '"?', [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => excluirFilme(id) },
    ]);
  }

  function ordemPorAno() {
    setFilmes((lista) =>
      [...lista].sort((a, b) => Number(a.ano) - Number(b.ano))
    );
  }

  function ordemAlfabetica() {
    setFilmes((lista) =>
      [...lista].sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
      )
    );
  }

  function Cabecalho() {
    return (
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Catálogo de filmes</Text>
        <Pressable style={styles.botao} onPress={() => router.push("/cadastrar")}>
          <Text style={styles.textoBotao}>Cadastrar filme</Text>
        </Pressable>
      </View>
    );
  }

  function Rodape() {
    return (
      <View style={styles.rodapeContainer}>
        <Pressable style={styles.botaoEmBaixo} onPress={ordemPorAno}>
          <Text style={styles.textoBotaoEmBaixo}>Ordem por Ano</Text>
        </Pressable>
        <Pressable style={styles.botaoEmBaixo} onPress={ordemAlfabetica}>
          <Text style={styles.textoBotaoEmBaixo}>Ordem alfabética</Text>
        </Pressable>
        <Text style={styles.rodape}>Fim do catálogo</Text>
      </View>
    );
  }

  function Separador() {
    return <View style={styles.separador} />;
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.conteudo}
      data={filmes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.filme}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text>Ano de lançamento: {item.ano}</Text>
          <Text>Idade indicativa: {item.idade}</Text>
          <Text>Gênero: {item.genero}</Text>
          <Text>Diretor: {item.diretor}</Text>
          <Pressable
            style={styles.botaoExcluir}
            onPress={() => confirmarExclusao(item.id, item.nome)}
          >
            <Text style={styles.textoBotao}>Excluir filme</Text>
          </Pressable>
        </View>
      )}
      ListHeaderComponent={Cabecalho}
      ListFooterComponent={Rodape}
      ItemSeparatorComponent={Separador}
      ListEmptyComponent={<Text style={styles.vazio}>Nenhum filme cadastrado.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  lista: { flex: 1 },
  conteudo: { padding: 16 },
  cabecalho: { alignItems: "center", marginBottom: 16 },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  filme: { padding: 12, backgroundColor: "#f1f1f1", borderRadius: 8, gap: 4 },
  nome: { fontSize: 18, fontWeight: "bold" },
  botao: { backgroundColor: "#2563eb", padding: 12, borderRadius: 6, alignItems: "center" },
  botaoExcluir: { backgroundColor: "#b91c1c", padding: 10, borderRadius: 6, alignItems: "center", marginTop: 8 },
  textoBotao: { color: "#ffffff", fontWeight: "bold" },
  separador: { height: 12 },
  rodapeContainer: { alignItems: "center", gap: 10, marginBottom: 16 },
  rodape: { textAlign: "center", padding: 20, color: "#555" },
  vazio: { textAlign: "center", padding: 20 },
  botaoEmBaixo: { backgroundColor: "#2563eb", padding: 12, borderRadius: 6, alignItems: "center", width: "100%" },
  textoBotaoEmBaixo: { color: "#ffffff", fontWeight: "bold" },
});
