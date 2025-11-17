import { useRouter } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function NavBar() {
    const router = useRouter();

    const HomeButton = () => (
        <Button title="Home" onPress={() => router.push("/")} />
    );
    const AgendaButton = () => (
        <Button title="Agenda" onPress={() => router.push("/agenda")} />
    );
    const HabitTrackerButton = () => (
        <Button
            title="Habit Tracker"
            onPress={() => router.push("/habitTracker")}
        />
    );
    const JournalButton = () => (
        <Button title="Journal" onPress={() => router.push("/journal")} />
    );

    return (
        <View style={styles.menu}>
            {HomeButton()}
            {AgendaButton()}
            {HabitTrackerButton()}
            {JournalButton()}
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
});
