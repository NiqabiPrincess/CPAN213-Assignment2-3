import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./components/navBar";

export default function Home() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>Welcome to the Home Page!</Text>
            </View>

            <NavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
    },
});
