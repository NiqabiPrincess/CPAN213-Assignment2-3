import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
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

function ProgressBar({ progress }: { progress: number }) {
    const animatedProgressValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let limitedProgress = progress;
        if (limitedProgress > 100) limitedProgress = 100;
        if (limitedProgress < 0) limitedProgress = 0;

        Animated.timing(animatedProgressValue, {
            toValue: limitedProgress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progress, animatedProgressValue]);

    return (
        <View style={styles.progressBar}>
            <Animated.View
                style={[
                    styles.progressFill,
                    {
                        width: animatedProgressValue.interpolate({
                            inputRange: [0, 100],
                            outputRange: ["0%", "100%"],
                        }),
                    },
                ]}
            />
        </View>
    );
}

interface Task {
    id: string;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
}

interface Habit {
    id: string;
    name: string;
}

export default function Home() {
    const [userName, setUserName] = useState("User");
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    const welcomeAnim = useRef(new Animated.Value(0)).current;
    const habitsScale = useRef(new Animated.Value(0.8)).current;

    const motivationalQuotes = [
        "The secret of getting ahead is getting started.",
        "Your future is created by what you do today.",
        "Small progress is still progress.",
        "You're capable of amazing things.",
        "One day at a time.",
    ];

    const [randomQuote] = useState(
        motivationalQuotes[
            Math.floor(Math.random() * motivationalQuotes.length)
        ]
    );

    const loadAllData = useCallback(async () => {
        try {
            const savedTasks = await AsyncStorage.getItem("@agenda_tasks");
            if (savedTasks !== null) {
                setTasks(JSON.parse(savedTasks));
            }

            const savedHabits = await AsyncStorage.getItem("@habits");
            if (savedHabits !== null) {
                const habitsData = JSON.parse(savedHabits);
                setHabits(habitsData);
            } else {
                setHabits([]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAllData();

        Animated.parallel([
            Animated.spring(welcomeAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(habitsScale, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }),
        ]).start();
    }, [habitsScale, loadAllData, welcomeAnim]);

    useFocusEffect(
        useCallback(() => {
            loadAllData();
        }, [loadAllData])
    );

    const today = new Date().toISOString().split("T")[0];
    const todaysTasks = {
        completed: tasks.filter((task) => task.date === today && task.completed)
            .length,
        total: tasks.filter((task) => task.date === today).length,
    };

    const completionPercentage =
        todaysTasks.total > 0
            ? Math.round((todaysTasks.completed / todaysTasks.total) * 100)
            : 0;

    function AnimatedHabitItem({
        habit,
        index,
    }: {
        habit: Habit;
        index: number;
    }) {
        const itemAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            const timer = setTimeout(() => {
                Animated.spring(itemAnim, {
                    toValue: 1,
                    friction: 8,
                    useNativeDriver: true,
                }).start();
            }, index * 200);

            return () => clearTimeout(timer);
        }, [itemAnim, index]);

        const animatedStyle = {
            transform: [{ scale: itemAnim }],
            opacity: itemAnim,
        };

        return (
            <Animated.View style={[styles.habitItem, animatedStyle]}>
                <View style={styles.habitBullet}>
                    <Text style={styles.habitBulletText}>•</Text>
                </View>
                <Text style={styles.habitName}>{habit.name}</Text>
            </Animated.View>
        );
    }

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

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5B8FB9" />
                    <Text style={styles.loadingText}>
                        Loading your wellness data...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <Animated.View
                        style={[
                            styles.welcomeSection,
                            {
                                transform: [
                                    {
                                        translateY: welcomeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-50, 0],
                                        }),
                                    },
                                ],
                                opacity: welcomeAnim,
                            },
                        ]}
                    >
                        <Text style={styles.welcomeText}>
                            Welcome, {userName}!
                        </Text>
                        <Text style={styles.quoteText}>{randomQuote}</Text>
                    </Animated.View>

                    <WeatherBox />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tasks Today</Text>
                        <View style={styles.progressContainer}>
                            <ProgressBar progress={completionPercentage} />
                            <Text style={styles.progressText}>
                                {todaysTasks.total === 0
                                    ? "No tasks for today"
                                    : `${todaysTasks.completed} of ${todaysTasks.total} tasks complete (${completionPercentage}%)`}
                            </Text>
                        </View>
                        {todaysTasks.total > 0 ? (
                            <View style={styles.taskListPreview}>
                                {tasks
                                    .filter((task) => task.date === today)
                                    .slice(0, 3)
                                    .map((task) => (
                                        <View
                                            key={task.id}
                                            style={styles.taskPreviewItem}
                                        >
                                            <Text
                                                style={
                                                    task.completed
                                                        ? styles.taskCompletedIcon
                                                        : styles.taskPendingIcon
                                                }
                                            >
                                                {task.completed ? "✓" : "○"}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.taskPreviewText,
                                                    task.completed &&
                                                        styles.taskPreviewCompleted,
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {task.title}
                                            </Text>
                                        </View>
                                    ))}
                                {tasks.filter((task) => task.date === today)
                                    .length > 3 && (
                                    <Text style={styles.moreTasksText}>
                                        +
                                        {tasks.filter(
                                            (task) => task.date === today
                                        ).length - 3}{" "}
                                        more...
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <Text style={styles.placeholderText}>
                                Add tasks in the Agenda page
                            </Text>
                        )}
                    </View>

                    <Animated.View
                        style={[
                            styles.section,
                            {
                                transform: [{ scale: habitsScale }],
                            },
                        ]}
                    >
                        <Text style={styles.sectionTitle}>Your Habits</Text>
                        {habits.length > 0 ? (
                            <View style={styles.habitsList}>
                                {habits.map((habit, index) => (
                                    <AnimatedHabitItem
                                        key={habit.id}
                                        habit={habit}
                                        index={index}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyHabits}>
                                <Text style={styles.emptyHabitsText}>
                                    No habits added yet
                                </Text>
                                <Text style={styles.emptyHabitsSubtext}>
                                    Add habits in the Habit Tracker to start
                                    building routines
                                </Text>
                            </View>
                        )}
                    </Animated.View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#031d36ff",
    },
    loadingText: {
        color: "#97b7d4ff",
        marginTop: 20,
        fontSize: 16,
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
    habitsList: {
        marginBottom: 10,
    },
    habitItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#F5F9FF",
        borderRadius: 8,
        marginBottom: 6,
    },
    habitBullet: {
        marginRight: 10,
    },
    habitBulletText: {
        fontSize: 16,
        color: "#5B8FB9",
        fontWeight: "bold",
    },
    habitName: {
        fontSize: 14,
        color: "#2D4356",
        fontWeight: "500",
    },
    emptyHabits: {
        alignItems: "center",
        padding: 20,
    },
    emptyHabitsText: {
        fontSize: 16,
        color: "#8BBCCC",
        fontWeight: "500",
        marginBottom: 8,
    },
    emptyHabitsSubtext: {
        fontSize: 14,
        color: "#8BBCCC",
        textAlign: "center",
        fontStyle: "italic",
    },
    placeholderText: {
        fontSize: 12,
        color: "#8BBCCC",
        textAlign: "center",
        fontStyle: "italic",
        marginTop: 5,
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
    taskListPreview: {
        marginTop: 10,
    },
    taskPreviewItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#F5F9FF",
        borderRadius: 8,
        marginBottom: 6,
    },
    taskCompletedIcon: {
        fontSize: 16,
        color: "#A5DD9B",
        fontWeight: "bold",
        marginRight: 10,
    },
    taskPendingIcon: {
        fontSize: 16,
        color: "#8BBCCC",
        marginRight: 10,
    },
    taskPreviewText: {
        fontSize: 14,
        color: "#2D4356",
        flex: 1,
    },
    taskPreviewCompleted: {
        textDecorationLine: "line-through",
        color: "#8BBCCC",
    },
    moreTasksText: {
        fontSize: 12,
        color: "#5B8FB9",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 4,
    },
});
