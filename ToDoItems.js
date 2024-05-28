import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "./colors";

export default function ToDoItems({
    deleteToDo,
    onEditText,
    doneToDo,
    working,
    toDos,
    editKey,
    editToDo,
    onBlur,
    setEdit,
    edit,
}) {
    return (
        <>
            {Object.keys(toDos)
                .reverse()
                .map((key) =>
                    toDos[key].working === working ? (
                        <View style={{ ...styles.toDo, backgroundColor: working ? theme.grey : theme.green }} key={key}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TouchableOpacity onPress={() => doneToDo(key)}>
                                    <MaterialCommunityIcons
                                        name={toDos[key].done ? "checkbox-marked" : "checkbox-blank-outline"}
                                        size={28}
                                        color={theme.white}
                                        style={{ marginRight: 10 }}
                                    />
                                </TouchableOpacity>
                                {editKey === key ? (
                                    <TextInput
                                        autoFocus={true}
                                        onSubmitEditing={editToDo}
                                        onChangeText={setEdit}
                                        returnKeyType="done"
                                        value={edit}
                                        style={{ color: theme.white, fontSize: 16 }}
                                        onBlur={onBlur}
                                    />
                                ) : (
                                    <Text
                                        style={{
                                            ...styles.toDoText,
                                            textDecorationLine: toDos[key].done ? "line-through" : "none",
                                            opacity: toDos[key].done ? 0.2 : 1,
                                        }}
                                    >
                                        {toDos[key].text}
                                    </Text>
                                )}
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity onPress={() => onEditText(key)}>
                                    <MaterialCommunityIcons
                                        name="pencil"
                                        style={{ opacity: 0.5, marginRight: 10 }}
                                        size={24}
                                        color={theme.white}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteToDo(key)}>
                                    <Fontisto name="trash" style={{ opacity: 0.5 }} size={22} color={theme.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null
                )}
        </>
    );
}

const styles = StyleSheet.create({
    toDo: {
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
