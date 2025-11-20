import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import NavBar from "./components/navBar";

interface Task {
    id: string;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
}

export default function Agenda() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        date: "",
        priority: "medium" as "high" | "medium" | "low",
    });

    // Load tasks from storage
    useEffect(() => {
        loadTasks();
    }, []);

    // Save tasks to storage
    useEffect(() => {
        saveTasks();
    }, [tasks]);

    const loadTasks = async () => {
        try {
            const savedTasks = await AsyncStorage.getItem("@agenda_tasks");
            if (savedTasks !== null) {
                setTasks(JSON.parse(savedTasks));
            }
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    const saveTasks = async () => {
        try {
            await AsyncStorage.setItem("@agenda_tasks", JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving tasks:", error);
        }
    };

    const addTask = () => {
        if (newTask.title.trim()) {
            const task: Task = {
                id: Date.now().toString(),
                title: newTask.title,
                description: newTask.description,
                date: newTask.date || new Date().toISOString().split("T")[0],
                completed: false,
                priority: newTask.priority,
            };
            setTasks([...tasks, task]);
            setNewTask({
                title: "",
                description: "",
                date: "",
                priority: "medium",
            });
            setModalVisible(false);
        }
    };

    const toggleTaskCompletion = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "#3B5BA5"; 
            case "medium":
                return "#7EC8E3"; 
            case "low":
                return "#A8E6CF";
            default:
                return "#7EC8E3";
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Agenda</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ Add Task</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.taskContainer}>
                    {tasks.map((task) => (
                        <View
                            key={task.id}
                            style={[
                                styles.taskCard,
                                {
                                    borderLeftColor: getPriorityColor(task.priority),
                                    opacity: task.completed ? 0.6 : 1,
                                },
                            ]}
                        >
                            <View style={styles.taskHeader}>
                                <TouchableOpacity
                                    onPress={() => toggleTaskCompletion(task.id)}
                                    style={styles.checkbox}
                                >
                                    <View
                                        style={[
                                            styles.checkboxInner,
                                            task.completed && styles.checkboxChecked,
                                        ]}
                                    >
                                        {task.completed && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.taskContent}>
                                    <Text
                                        style={[
                                            styles.taskTitle,
                                            task.completed && styles.taskTitleCompleted,
                                        ]}
                                    >
                                        {task.title}
                                    </Text>
                                    <Text style={styles.taskDescription}>
                                        {task.description}
                                    </Text>
                                    <Text style={styles.taskDate}>{task.date}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => deleteTask(task.id)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteButtonText}>×</Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={[
                                    styles.priorityBadge,
                                    { backgroundColor: getPriorityColor(task.priority) },
                                ]}
                            >
                                <Text style={styles.priorityText}>
                                    {task.priority.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Task</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Task Title"
                            value={newTask.title}
                            onChangeText={(text) =>
                                setNewTask({ ...newTask, title: text })
                            }
                            placeholderTextColor="#999"
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description"
                            value={newTask.description}
                            onChangeText={(text) =>
                                setNewTask({ ...newTask, description: text })
                            }
                            multiline
                            numberOfLines={3}
                            placeholderTextColor="#999"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Date (YYYY-MM-DD)"
                            value={newTask.date}
                            onChangeText={(text) =>
                                setNewTask({ ...newTask, date: text })
                            }
                            placeholderTextColor="#999"
                        />

                        <View style={styles.prioritySelector}>
                            <Text style={styles.priorityLabel}>Priority:</Text>
                            <View style={styles.priorityButtons}>
                                {["high", "medium", "low"].map((priority) => (
                                    <TouchableOpacity
                                        key={priority}
                                        style={[
                                            styles.priorityButton,
                                            {
                                                backgroundColor: getPriorityColor(priority),
                                            },
                                            newTask.priority === priority &&
                                                styles.priorityButtonSelected,
                                        ]}
                                        onPress={() =>
                                            setNewTask({
                                                ...newTask,
                                                priority: priority as "high" | "medium" | "low",
                                            })
                                        }
                                    >
                                        <Text style={styles.priorityButtonText}>
                                            {priority.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={addTask}
                            >
                                <Text style={styles.saveButtonText}>Add Task</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <NavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        backgroundColor: "#C8F7C5", 
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2C3E50",
    },
    addButton: {
        backgroundColor: "#3B5BA5", 
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
    },
    taskContainer: {
        padding: 16,
    },
    taskCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    taskHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    checkbox: {
        marginRight: 12,
        marginTop: 2,
    },
    checkboxInner: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#3B5BA5",
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#3B5BA5",
    },
    checkmark: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2C3E50",
        marginBottom: 4,
    },
    taskTitleCompleted: {
        textDecorationLine: "line-through",
        color: "#999",
    },
    taskDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    taskDate: {
        fontSize: 12,
        color: "#999",
    },
    deleteButton: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFE5E5",
        borderRadius: 14,
    },
    deleteButtonText: {
        color: "#FF4444",
        fontSize: 20,
        fontWeight: "bold",
    },
    priorityBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    priorityText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 24,
        width: "90%",
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
    },
    prioritySelector: {
        marginBottom: 20,
    },
    priorityLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2C3E50",
        marginBottom: 8,
    },
    priorityButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: "center",
    },
    priorityButtonSelected: {
        borderWidth: 3,
        borderColor: "#2C3E50",
    },
    priorityButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 6,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#E0E0E0",
    },
    cancelButtonText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "600",
    },
    saveButton: {
        backgroundColor: "#A8E6CF",
    },
    saveButtonText: {
        color: "#2C3E50",
        fontSize: 16,
        fontWeight: "600",
    },
});
