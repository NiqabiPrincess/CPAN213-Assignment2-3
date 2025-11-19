import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import NavBar from "./components/navBar";

type Habit = { id: string; name: string };

export default function HabitTracker() {
  const [habit, setHabit] = useState<string>("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch motivational quote
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.quotable.io/random");
        const data = await res.json();
        setQuote(data.content);
      } catch (err) {
        setQuote("Keep going — small steps count!");
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  // Add habit
  const addHabit = () => {
    if (!habit.trim()) return;
    const newHabit = { id: Date.now().toString(), name: habit.trim() };
    setHabits((prev) => [newHabit, ...prev]);
    setHabit("");
    Alert.alert("Success", "Habit added!");
  };

  // Delete habit
  const deleteHabit = useCallback((id: string) => {
    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setHabits((prev) => prev.filter((h) => h.id !== id));
        },
      },
    ]);
  }, []);

  // Habit Item with animation
  const HabitItem = ({ item }: { item: Habit }) => {
    const fade = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ scale }],
          backgroundColor: "#f2f2f2",
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
          <TouchableOpacity onPress={() => deleteHabit(item.id)}>
            <Text style={{ color: "red" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Habit Tracker</Text>

      {/* Quote */}
      {loading ? <ActivityIndicator size="small" /> : <Text style={{ fontStyle: "italic", color: "#444", marginBottom: 12 }}>{quote}</Text>}

      {/* Input + Add button */}
      <TextInput
        value={habit}
        onChangeText={setHabit}
        placeholder="Enter a habit (e.g. Drink water)"
        style={{ borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}
      />
      <TouchableOpacity
        onPress={addHabit}
        style={{ backgroundColor: "#3b82f6", padding: 12, borderRadius: 8, marginBottom: 16, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Add Habit</Text>
      </TouchableOpacity>

      {/* Habit list */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitItem item={item} />}
        ListEmptyComponent={<Text style={{ color: "#666" }}>No habits yet — add one above.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* NavBar */}
      <View style={{ marginTop: "auto" }}>
        <NavBar />
      </View>
    </View>
  );
}
