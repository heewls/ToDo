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
import ToDoItems from "./ToDoItems";

const STORAGE_KEY = "@toDos";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});
    const [edit, setEdit] = useState("");
    const [editKey, setEditKey] = useState(null);
    const [workingTitle, setWorkingTitle] = useState("");
    const [travelTitle, setTravelTitle] = useState("");

    useEffect(() => {
        loadToDos();
        loadWorking();
        loadTitles();
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

    const onChangeTitle = (payload) => {
        if (working) setWorkingTitle(payload);
        else setTravelTitle(payload);
    };

    const saveToDos = async (toSave) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {
            alert(e);
        }
    };

    const savePage = async (page) => {
        try {
            await AsyncStorage.setItem("@working", JSON.stringify(page));
        } catch (e) {
            alert(e);
        }
    };

    const saveTitles = async () => {
        try {
            await AsyncStorage.setItem("@workingTitle", workingTitle);
            await AsyncStorage.setItem("@travelTitle", travelTitle);
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

    const loadTitles = async () => {
        try {
            const wt = await AsyncStorage.getItem("@workingTitle");
            const tt = await AsyncStorage.getItem("@travelTitle");
            if (wt !== null) {
                setWorkingTitle(wt);
            }
            if (tt !== null) {
                setTravelTitle(tt);
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

    const editToDo = () => {
        if (editKey !== null) {
            const newToDos = { ...toDos };
            newToDos[editKey] = { ...newToDos[editKey], text: edit };
            setToDos(newToDos);
            saveToDos(newToDos);
            setEditKey(null);
            setEdit("");
        }
    };

    const onEditText = (key) => {
        setEditKey(key);
        setEdit(toDos[key].text);
    };

    const addTitle = async () => {
        await saveTitles();
    };

    return (
        <View style={{ ...styles.container, backgroundColor: working ? theme.black : theme.white }}>
            <StatusBar style={working ? "light" : "dark"} />
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? theme.white : theme.green,
                            opacity: working ? 1 : 0.2,
                        }}
                    >
                        Work
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? theme.white : theme.green,
                            opacity: working ? 0.2 : 1,
                        }}
                    >
                        Travel
                    </Text>
                </TouchableOpacity>
            </View>
            <TextInput
                onSubmitEditing={addTitle}
                onChangeText={onChangeTitle}
                returnKeyType="done"
                value={working ? workingTitle : travelTitle}
                style={{
                    ...styles.title,
                    color: working ? theme.white : theme.green,
                }}
                placeholder={working ? "Title for Work" : "Title for Travel"}
            />
            <TextInput
                onSubmitEditing={addToDo}
                onChangeText={onChangeText}
                returnKeyType="done"
                value={text}
                style={{ ...styles.input, backgroundColor: working ? theme.white : theme.greenOpacity }}
                placeholder="Add A To Do"
            />
            {Object.keys(toDos).length === 0 ? (
                <View style={{ alignItems: "center" }}>
                    <ActivityIndicator color={theme.white} style={{ marginTop: 10 }} size="large" />
                </View>
            ) : (
                <ScrollView>
                    <ToDoItems
                        deleteToDo={deleteToDo}
                        onEditText={onEditText}
                        doneToDo={doneToDo}
                        working={working}
                        toDos={toDos}
                        editKey={editKey}
                        editToDo={editToDo}
                        onBlur={() => setEditKey(null)}
                        setEdit={setEdit}
                        edit={edit}
                    />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },
    btnText: {
        fontSize: 38,
        fontWeight: "600",
    },
    title: {
        paddingHorizontal: 5,
        paddingTop: 15,
        fontSize: 24,
        fontWeight: "600",
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 20,
        fontSize: 20,
    },
});
