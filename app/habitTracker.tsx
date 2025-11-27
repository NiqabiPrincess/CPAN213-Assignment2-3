import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NavBar from "./components/navBar";

type Habit = { id: string; name: string };

// THEME COLORS — matching your Home page
const COLORS = {
  background: "#0D1B2A",
  card: "#E8F0D9",
  inputBorder: "#C3D8A6",
  button: "#A8C686",
  buttonText: "#0D1B2A",
  text: "#0D1B2A",
  delete: "#8B0000",
};

export default function HabitTracker() {
  const [habit, setHabit] = useState<string>("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* --------------------------
     Load habits on page focus
  -------------------------- */
  useFocusEffect(
    useCallback(() => {
      const loadHabits = async () => {
        try {
          const json = await AsyncStorage.getItem("@habits");
          if (json) {
            setHabits(JSON.parse(json));
          }
        } catch (e) {
          console.log("Error loading habits:", e);
        }
      };
      loadHabits();
    }, [])
  );

  /* --------------------------
        Save habits to storage
  -------------------------- */
  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem("@habits", JSON.stringify(newHabits));
    } catch (e) {
      console.log("Error saving:", e);
    }
  };

  /* --------------------------
        Motivational Quote
  -------------------------- */
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.quotable.io/random");
        const data = await res.json();
        setQuote(data.content);
      } catch {
        setQuote("Keep going — small steps count!");
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  /* --------------------------
            Add Habit
  -------------------------- */
  const addHabit = () => {
    if (!habit.trim()) return;

    const newHabit = { id: Date.now().toString(), name: habit.trim() };
    const updated = [newHabit, ...habits];

    setHabits(updated);
    saveHabits(updated);

    setHabit("");
  };

  /* --------------------------
           Delete Habit
  -------------------------- */
  const deleteHabit = useCallback(
    (id: string) => {
      Alert.alert("Delete Habit", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updated = habits.filter((h) => h.id !== id);
            setHabits(updated);
            saveHabits(updated);
          },
        },
      ]);
    },
    [habits]
  );

  /* --------------------------
        Habit Item Animation
  -------------------------- */
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
          backgroundColor: COLORS.card,
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 16, color: COLORS.text }}>{item.name}</Text>

        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
          <TouchableOpacity onPress={() => deleteHabit(item.id)}>
            <Text style={{ color: COLORS.delete }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  /* --------------------------
              UI
  -------------------------- */
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: COLORS.background }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
          marginBottom: 10,
        }}
      >
        Habit Tracker
      </Text>

      {/* Quote */}
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text
          style={{
            fontStyle: "italic",
            color: "#d0d6e0",
            marginBottom: 12,
          }}
        >
          {quote}
        </Text>
      )}

      {/* Input */}
      <TextInput
        value={habit}
        onChangeText={setHabit}
        placeholder="Enter a habit..."
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: COLORS.inputBorder,
          backgroundColor: "white",
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
          color: COLORS.text,
        }}
      />

      {/* Add Button */}
      <TouchableOpacity
        onPress={addHabit}
        style={{
          backgroundColor: COLORS.button,
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: COLORS.buttonText, fontWeight: "bold" }}>Add Habit</Text>
      </TouchableOpacity>

      {/* Habit List */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitItem item={item} />}
        ListEmptyComponent={
          <Text style={{ color: "#bfc5cf", marginTop: 20 }}>No habits yet — add one above.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={{ marginTop: "auto" }}>
        <NavBar />
      </View>
    </View>
  );
}
