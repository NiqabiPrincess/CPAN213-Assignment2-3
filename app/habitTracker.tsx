import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NavBar from "./components/navBar";

type Habit = { id: string; name: string };

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
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------
        Load saved habits
  -------------------------- */
  useFocusEffect(
    useCallback(() => {
      const loadHabits = async () => {
        try {
          const stored = await AsyncStorage.getItem("@habits");
          if (stored) setHabits(JSON.parse(stored));
        } catch (e) {
          console.log("Error loading habits:", e);
        }
      };
      loadHabits();
    }, [])
  );

  /* --------------------------
        Save Habits
  -------------------------- */
  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem("@habits", JSON.stringify(newHabits));
    } catch (e) {
      console.log("Saving error:", e);
    }
  };

  /* --------------------------
       Fetch motivational quote
  -------------------------- */
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.quotable.io/random");
        const data = await res.json();
        setQuote(data.content);
      } catch {
        setQuote("Small steps create big wins.");
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

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habit.trim(),
    };

    setHabits((prev) => {
      const updated = [newHabit, ...prev];
      saveHabits(updated);
      return updated;
    });

    setHabit("");
  };

  /* --------------------------
         Delete Habit
  -------------------------- */
  const deleteHabit = (id: string) => {
    setHabits((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      saveHabits(updated);
      return updated;
    });
  };

  /* --------------------------
      Habit Item Component
  -------------------------- */
  const HabitItem = ({ item }: { item: Habit }) => {
    const fade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fade, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: fade,
          backgroundColor: COLORS.card,
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 16, color: COLORS.text }}>{item.name}</Text>

        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 6 }}>
          <TouchableOpacity onPress={() => deleteHabit(item.id)}>
            <Text style={{ color: COLORS.delete, fontWeight: "bold" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

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

      {loading ? (
        <ActivityIndicator color="#fff" />
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

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitItem item={item} />}
        ListEmptyComponent={
          <Text style={{ color: "#bfc5cf", marginTop: 20 }}>
            No habits yet — add one above.
          </Text>
        }
      />

      <View style={{ marginTop: "auto" }}>
        <NavBar />
      </View>
    </View>
  );
}
