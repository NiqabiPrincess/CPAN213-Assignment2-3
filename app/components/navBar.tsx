import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NavBar() {
    const router = useRouter();

    return (
        <View style={styles.navBar}>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => router.push("/")}
            >
                <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navButton}
                onPress={() => router.push("/agenda")}
            >
                <Text style={styles.navText}>Agenda</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navButton}
                onPress={() => router.push("/habitTracker")}
            >
                <Text style={styles.navText}>Habits</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navButton}
                onPress={() => router.push("/journal")}
            >
                <Text style={styles.navText}>Journal</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: "#B6E2D3", // Mint Green
        backgroundColor: "#FFFFFF", // White
    },
    navButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#E8F3D6", // Pale SeaFoam
    },
    navText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2D4356", // Deep Navy
    },
});
