import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const CANADIAN_CITIES = [
    { name: "Toronto", latitude: 43.6532, longitude: -79.3832 },
    { name: "Vancouver", latitude: 49.2827, longitude: -123.1207 },
    { name: "Montreal", latitude: 45.5019, longitude: -73.5674 },
    { name: "Calgary", latitude: 51.0447, longitude: -114.0719 },
    { name: "Edmonton", latitude: 53.5461, longitude: -113.4938 },
    { name: "Ottawa", latitude: 45.4215, longitude: -75.6972 },
    { name: "Winnipeg", latitude: 49.8954, longitude: -97.1385 },
    { name: "Quebec City", latitude: 46.8139, longitude: -71.208 },
    { name: "Halifax", latitude: 44.6488, longitude: -63.5752 },
];

export default function WeatherBox() {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [weatherCode, setWeatherCode] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState("Toronto");

    const fetchWeather = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const city =
                CANADIAN_CITIES.find((c) => c.name === selectedCity) ||
                CANADIAN_CITIES[0];
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`;

            const response = await fetch(url);
            const data = await response.json();

            setTemperature(data.current_weather.temperature);
            setWeatherCode(data.current_weather.weathercode);
        } catch (err) {
            setError("Failed to load weather: " + err);
        } finally {
            setLoading(false);
        }
    }, [selectedCity]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    const getWeatherMessage = () => {
        if (!weatherCode) return "";
        if (weatherCode === 0) return "Clear and sunny";
        if (weatherCode === 1 || weatherCode === 2) return "Partly cloudy";
        if (weatherCode === 3) return "Cloudy";
        if (weatherCode >= 51 && weatherCode <= 67) return "Drizzling";
        if (weatherCode >= 71 && weatherCode <= 77) return "Snowing";
        if (weatherCode >= 80) return "Rain showers";
        return "Weather conditions unknown";
    };

    const getTemperatureAdvice = () => {
        if (temperature === null) return "";
        if (temperature < -10) return "It's Bone-Cold! Wear Extra Layers";
        if (temperature < 0) return "It's freezing! Keep Warm";
        if (temperature < 10) return "Pretty Chilly Out there, Bring a Jacket";
        if (temperature < 20) return "Mild Weather - Dress Comfy";
        if (temperature < 30) return "Warm Day - Stay Hydrated";
        return "It's HOT! Drink Lots of Water";
    };

    return (
        <View style={styles.box}>
            <Text style={styles.title}>Weather Today</Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedCity}
                    onValueChange={setSelectedCity}
                    style={styles.picker}
                >
                    {CANADIAN_CITIES.map((city) => (
                        <Picker.Item
                            key={city.name}
                            label={city.name}
                            value={city.name}
                        />
                    ))}
                </Picker>
            </View>

            {loading && <ActivityIndicator size="large" color="#5B8FB9" />}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>{error}</Text>
                    <Text style={styles.retry} onPress={fetchWeather}>
                        Tap to retry
                    </Text>
                </View>
            )}

            {!loading && !error && temperature !== null && (
                <>
                    <Text style={styles.temp}>{temperature}°C</Text>
                    <Text style={styles.desc}>{getWeatherMessage()}</Text>
                    <Text style={styles.advice}>{getTemperatureAdvice()}</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "#E8F3D6",
        margin: 20,
        padding: 20,
        borderRadius: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
        color: "#2D4356",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#B6E2D3",
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: "white",
    },
    picker: {
        color: "#2D4356",
    },
    temp: {
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
        color: "#5B8FB9",
        marginBottom: 8,
    },
    desc: {
        fontSize: 18,
        textAlign: "center",
        color: "#2D4356",
        marginBottom: 5,
    },
    advice: {
        fontSize: 16,
        textAlign: "center",
        color: "#5B8FB9",
        fontStyle: "italic",
    },
    errorContainer: {
        alignItems: "center",
        padding: 10,
    },
    error: {
        color: "#FF6B6B",
        textAlign: "center",
        marginBottom: 5,
    },
    retry: {
        color: "#5B8FB9",
        textDecorationLine: "underline",
    },
});
