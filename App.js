import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "./colors";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@toDos";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});

    useEffect(() => {
        loadToDos();
        loadWorking();
    }, []);

    const travel = () => {
        setWorking(false);
        savePage(false);
    };

    const work = () => {
        setWorking(true);
        savePage(true);
    };

    const onChangeText = (payload) => setText(payload);

    const saveToDos = async (toSave) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    };

    const savePage = async (page) => {
        try {
            await AsyncStorage.setItem("@working", JSON.stringify(page));
        } catch (e) {
            alert(e);
        }
    };

    const loadToDos = async () => {
        try {
            const s = await AsyncStorage.getItem(STORAGE_KEY);
            setToDos(JSON.parse(s));
        } catch (e) {
            alert(e);
        }
    };

    const loadWorking = async () => {
        try {
            const w = await AsyncStorage.getItem("@working");
            if (w !== null) {
                setWorking(JSON.parse(w));
            }
        } catch (e) {
            alert(e);
        }
    };

    const addToDo = async () => {
        if (text === "") {
            return;
        }
        // const newToDos = Object.assign({}, toDos, { [Date.now()]: { text, work: working } });
        const newToDos = { ...toDos, [Date.now()]: { text, working, done: false } };
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
    };

    const deleteToDo = (key) => {
        Alert.alert("Delete", "Sure?", [
            { text: "Cancel" },
            {
                text: "Sure",
                style: "destructive",
                onPress: () => {
                    const newToDos = { ...toDos };
                    delete newToDos[key];
                    setToDos(newToDos);
                    saveToDos(newToDos);
                },
            },
        ]);
        return;
    };

    const doneToDo = (key) => {
        const newToDos = { ...toDos };
        newToDos[key] = { ...newToDos[key], done: !newToDos[key].done };
        setToDos(newToDos);
        saveToDos(newToDos);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{ ...styles.btnText, color: working ? theme.white : theme.grey }}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text style={{ ...styles.btnText, color: working ? theme.grey : theme.white }}>Travel</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                onSubmitEditing={addToDo}
                onChangeText={onChangeText}
                returnKeyType="done"
                value={text}
                style={styles.input}
                placeholder={working ? "Add A To Do For Working" : "Add A To Do For Traveling"}
            />
            {Object.keys(toDos).length === 0 ? (
                <View style={{ alignItems: "center" }}>
                    <ActivityIndicator color={theme.white} style={{ marginTop: 10 }} size="large" />
                </View>
            ) : (
                <ScrollView>
                    {Object.keys(toDos).map((key) =>
                        toDos[key].working === working ? (
                            <View style={styles.toDo} key={key}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => doneToDo(key)}>
                                        <MaterialCommunityIcons
                                            name={toDos[key].done ? "checkbox-marked" : "checkbox-blank-outline"}
                                            size={28}
                                            color={theme.white}
                                            style={{ marginRight: 10 }}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            ...styles.toDoText,
                                            textDecorationLine: toDos[key].done ? "line-through" : "none",
                                            opacity: toDos[key].done ? 0.2 : 1,
                                        }}
                                    >
                                        {toDos[key].text}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteToDo(key)}>
                                    <Fontisto name="trash" style={{ opacity: 0.2 }} size={22} color={theme.white} />
                                </TouchableOpacity>
                            </View>
                        ) : null
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.black,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },
    btnText: {
        color: theme.white,
        fontSize: 38,
        fontWeight: "600",
    },
    input: {
        backgroundColor: theme.white,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 20,
        fontSize: 18,
    },
    toDo: {
        backgroundColor: theme.grey,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    toDoText: {
        color: theme.white,
        fontSize: 18,
        fontWeight: "500",
    },
});
