import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import NavBar from "./components/navBar";

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: string;
}

export default function Journal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newEntry, setNewEntry] = useState({
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [quote, setQuote] = useState<string | null>(null);
    const [loadingQuote, setLoadingQuote] = useState<boolean>(true);

    // Fetch motivational quote
    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch("https://api.quotable.io/random");
                const data = await res.json();
                setQuote(data.content);
            } catch (err) {
                setQuote("Reflect on your journey — every entry counts!");
            } finally {
                setLoadingQuote(false);
            }
        };
        fetchQuote();
    }, []);

    // Load entries from storage
    useEffect(() => {
        loadEntries();
    }, []);

    // Save entries to storage
    useEffect(() => {
        saveEntries();
    }, [entries]);

    const loadEntries = async () => {
        try {
            const savedEntries = await AsyncStorage.getItem("@journal_entries");
            if (savedEntries !== null) {
                setEntries(JSON.parse(savedEntries));
            }
        } catch (error) {
            console.error("Error loading journal entries:", error);
        }
    };

    const saveEntries = async () => {
        try {
            await AsyncStorage.setItem("@journal_entries", JSON.stringify(entries));
        } catch (error) {
            console.error("Error saving journal entries:", error);
        }
    };

    const addEntry = () => {
        if (newEntry.title.trim() || newEntry.content.trim()) {
            const entry: JournalEntry = {
                id: Date.now().toString(),
                title: newEntry.title.trim(),
                content: newEntry.content.trim(),
                date: newEntry.date || new Date().toISOString().split("T")[0],
            };
            setEntries([...entries, entry]);
            setNewEntry({
                title: "",
                content: "",
                date: new Date().toISOString().split("T")[0],
            });
            setModalVisible(false);
        }
    };

    const deleteEntry = (id: string) => {
        setEntries(entries.filter((entry) => entry.id !== id));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Journal</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ Add Entry</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.entryContainer}>
                    {/* Quote */}
                    {loadingQuote ? (
                        <ActivityIndicator size="small" color="#3B5BA5" />
                    ) : (
                        <Text style={styles.quoteText}>{quote}</Text>
                    )}

                    {entries.map((entry) => (
                        <View key={entry.id} style={styles.entryCard}>
                            <View style={styles.entryHeader}>
                                <View style={styles.entryContent}>
                                    <Text style={styles.entryTitle}>{entry.title}</Text>
                                    <Text style={styles.entryDate}>{entry.date}</Text>
                                    <Text style={styles.entryContentText}>
                                        {entry.content}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => deleteEntry(entry.id)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteButtonText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    {entries.length === 0 && (
                        <Text style={styles.placeholderText}>
                            No entries yet — add one to start reflecting!
                        </Text>
                    )}
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
                        <Text style={styles.modalTitle}>Add New Journal Entry</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Entry Title (optional)"
                            value={newEntry.title}
                            onChangeText={(text) =>
                                setNewEntry({ ...newEntry, title: text })
                            }
                            placeholderTextColor="#999"
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Your thoughts and reflections..."
                            value={newEntry.content}
                            onChangeText={(text) =>
                                setNewEntry({ ...newEntry, content: text })
                            }
                            multiline
                            numberOfLines={6}
                            placeholderTextColor="#999"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Date (YYYY-MM-DD)"
                            value={newEntry.date}
                            onChangeText={(text) =>
                                setNewEntry({ ...newEntry, date: text })
                            }
                            placeholderTextColor="#999"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={addEntry}
                            >
                                <Text style={styles.saveButtonText}>Add Entry</Text>
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
        backgroundColor: "#031d36ff",
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
        color: "#2D4356",
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
    entryContainer: {
        padding: 16,
    },
    quoteText: {
        fontSize: 16,
        color: "#ffffffff",
        fontStyle: "italic",
        textAlign: "center",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    entryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 6,
        borderLeftColor: "#7EC8E3",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    entryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    entryContent: {
        flex: 1,
    },
    entryTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2D4356",
        marginBottom: 4,
    },
    entryDate: {
        fontSize: 12,
        color: "#999",
        marginBottom: 8,
    },
    entryContentText: {
        fontSize: 14,
        color: "#666",
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
    placeholderText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
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
        height: 120,
        textAlignVertical: "top",
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