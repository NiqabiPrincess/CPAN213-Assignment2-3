import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./components/navBar";
import WeatherBox from "./components/weatherBox";

export default function Home() {
    const [userName, setUserName] = useState("User");
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");

    //!Fake data
    const todaysTasks = { completed: 3, total: 7 };
    const completionPercentage = Math.round(
        (todaysTasks.completed / todaysTasks.total) * 100
    );

    //! Fake data
    const habits = [
        { name: "Water", progress: 80 },
        { name: "Exercise", progress: 40 },
        { name: "Sleep", progress: 60 },
    ];

    const motivationalQuotes = [
        "The secret of getting ahead is getting started.",
        "Your future is created by what you do today.",
        "Small progress is still progress.",
        "You're capable of amazing things.",
        "One day at a time.",
    ];

    const randomQuote =
        motivationalQuotes[
            Math.floor(Math.random() * motivationalQuotes.length)
        ];

    const handleEditName = () => {
        setTempName(userName);
        setIsEditingName(true);
    };

    const handleSaveName = () => {
        if (tempName.trim()) {
            setUserName(tempName.trim());
        }
        setIsEditingName(false);
    };

    const handleCancelEdit = () => {
        setIsEditingName(false);
        setTempName("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeText}>
                            Welcome, {userName}!
                        </Text>
                        <Text style={styles.quoteText}>{randomQuote}</Text>
                    </View>

                    <WeatherBox />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tasks Today</Text>
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${completionPercentage}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {todaysTasks.completed} of {todaysTasks.total}{" "}
                                tasks complete ({completionPercentage}%)
                            </Text>
                        </View>
                        <Text style={styles.placeholderText}>
                            Task details will appear here when Agenda page is
                            ready
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Daily Habits</Text>
                        <View style={styles.habitsContainer}>
                            {habits.map((habit, index) => (
                                <View key={index} style={styles.habitItem}>
                                    <View style={styles.habitCircle}>
                                        <Text style={styles.habitProgress}>
                                            {habit.progress}%
                                        </Text>
                                    </View>
                                    <Text style={styles.habitName}>
                                        {habit.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.placeholderText}>
                            Habit tracking will sync when Habit Tracker is ready
                        </Text>
                    </View>

                    <View style={styles.nameSection}>
                        <Text style={styles.nameSectionTitle}>
                            Personalize Your Experience
                        </Text>

                        {isEditingName ? (
                            <View style={styles.editContainer}>
                                <TextInput
                                    style={styles.nameInput}
                                    value={tempName}
                                    onChangeText={setTempName}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#8BBCCC"
                                    autoFocus={true}
                                />
                                <View style={styles.editButtons}>
                                    <TouchableOpacity
                                        style={[
                                            styles.nameButton,
                                            styles.cancelButton,
                                        ]}
                                        onPress={handleCancelEdit}
                                    >
                                        <Text style={styles.buttonText}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.nameButton,
                                            styles.saveButton,
                                        ]}
                                        onPress={handleSaveName}
                                    >
                                        <Text style={styles.buttonText}>
                                            Save
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.nameDisplay}
                                onPress={handleEditName}
                            >
                                <Text style={styles.nameDisplayText}>
                                    Change name:{" "}
                                    <Text style={styles.currentName}>
                                        {userName}
                                    </Text>
                                </Text>
                                <Text style={styles.editHint}>Tap to edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>

            <NavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#031d36ff",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingVertical: 20,
    },
    welcomeSection: {
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#97b7d4ff",
        marginBottom: 8,
    },
    quoteText: {
        fontSize: 16,
        color: "#bdd4e7ff",
        textAlign: "center",
        fontStyle: "italic",
        marginHorizontal: 20,
    },
    section: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#2D4356",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2D4356",
        marginBottom: 15,
    },
    progressContainer: {
        alignItems: "center",
        marginBottom: 10,
    },
    progressBar: {
        width: "100%",
        height: 12,
        backgroundColor: "#E8F3D6",
        borderRadius: 6,
        marginBottom: 8,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#A5DD9B",
        borderRadius: 6,
    },
    progressText: {
        fontSize: 14,
        color: "#5B8FB9",
        fontWeight: "500",
    },
    habitsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 10,
    },
    habitItem: {
        alignItems: "center",
    },
    habitCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#E8F3D6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    habitProgress: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#2D4356",
    },
    habitName: {
        fontSize: 14,
        color: "#2D4356",
        fontWeight: "500",
    },
    placeholderText: {
        fontSize: 12,
        color: "#8BBCCC",
        textAlign: "center",
        fontStyle: "italic",
        marginTop: 5,
    },
    nameSection: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#2D4356",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nameSectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2D4356",
        marginBottom: 15,
        textAlign: "center",
    },
    nameDisplay: {
        alignItems: "center",
        padding: 15,
        backgroundColor: "#E8F3D6",
        borderRadius: 12,
    },
    nameDisplayText: {
        fontSize: 16,
        color: "#2D4356",
        marginBottom: 5,
    },
    currentName: {
        fontWeight: "bold",
        color: "#5B8FB9",
    },
    editHint: {
        fontSize: 12,
        color: "#8BBCCC",
        fontStyle: "italic",
    },
    editContainer: {
        alignItems: "center",
    },
    nameInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#B6E2D3",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "#2D4356",
        backgroundColor: "#FFFFFF",
        marginBottom: 15,
    },
    editButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    nameButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
    },
    saveButton: {
        backgroundColor: "#5B8FB9",
    },
    cancelButton: {
        backgroundColor: "#8BBCCC",
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
    },
});
