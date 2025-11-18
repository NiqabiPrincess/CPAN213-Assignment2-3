import { Text, View } from "react-native";
import NavBar from "./components/navBar";

export default function habitTracker() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>This is the Journal Page.</Text>
            <NavBar />
        </View>
    );
}
