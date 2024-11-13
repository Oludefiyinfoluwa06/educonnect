import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { config } from '@/config';
import { getToken, logout } from '@/utils';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

interface Student {
    _id: string;
    name: string;
    email: string;
    class: string;
    studentId: string;
    age: number;
    gender: 'male' | 'female';
    guardianName: string;
}

const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-8">
        <Ionicons name="people-outline" size={64} color="#9CA3AF" />
        <Text className="text-gray-500 font-rmedium text-lg mt-4">No students found</Text>
        <Text className="text-gray-400 font-rregular text-center mt-2">
            Add your first student by clicking the 'Add Student' button above
        </Text>
    </View>
);

const StudentCard: React.FC<Student> = ({ name, class: studentClass, studentId }) => (
    <TouchableOpacity
        className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row justify-between items-center"
        onPress={() => {
            router.push(`../(screens)/student?studentId=${studentId}`);
        }}
    >
        <View>
            <Text className="text-gray-800 font-rsemibold">{name}</Text>
            <Text className="text-gray-600 font-rregular">{studentClass}</Text>
        </View>
        <View className="flex-row justify-end items-center">
            <Text className="text-gray-500 text-sm font-rregular mr-2">{studentId}</Text>
            <Ionicons name="chevron-forward" size={20} color="#4B5563" />
        </View>
    </TouchableOpacity>
);

const Students = () => {
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [newStudent, setNewStudent] = useState<Partial<Student>>({});
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                const response = await axios.get(`${config.BASE_API_URL}/api/students/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setStudents(response.data);
            } catch (error: any) {
                if (error.response.data.message) {
                    if (error.response.data.message === "Unauthorized") {
                        await logout();
                    }
                }

                if (error.response.data.error === "Student not found") {
                    setStudents([]);
                } else {
                    Alert.alert('Error', 'Failed to fetch students');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleAddStudent = async () => {
        if (!newStudent.name || !newStudent.class || !newStudent.age || !newStudent.email || !newStudent.gender || !newStudent.guardianName) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            const response = await axios.post(`${config.BASE_API_URL}/api/students`, newStudent, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setStudents(prev => [...prev, response.data]);
            setNewStudent({});
            setShowAddStudentForm(false);
            Alert.alert('Success', 'Student added successfully.');
        } catch (error: any) {
            if (error.response.data.message) {
                if (error.response.data.message === "Unauthorized") {
                    await logout();
                }
            }

            Alert.alert('Error', error.response.data.error);
        }
        setLoading(false);
    };

    const renderHeader = () => (
        <>
            <View className="flex-row justify-between items-center py-4">
                <Text className="text-xl font-rbold text-gray-800">Students</Text>
                <TouchableOpacity
                    className="bg-blue-600 px-4 py-2 rounded-full"
                    onPress={() => setShowAddStudentForm(!showAddStudentForm)}
                >
                    <Text className="text-white font-rmedium">{showAddStudentForm ? 'Close' : 'Add Student'}</Text>
                </TouchableOpacity>
            </View>

            {showAddStudentForm && (
                <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <TextInput
                        className="border border-gray-200 rounded-lg p-3 mb-3 font-rregular"
                        placeholder="Student Name"
                        value={newStudent.name}
                        onChangeText={(text) => setNewStudent(prev => ({ ...prev, name: text }))}
                    />
                    <TextInput
                        className="border border-gray-200 rounded-lg p-3 mb-3 font-rregular"
                        placeholder="Parent Email"
                        value={newStudent.email}
                        onChangeText={(text) => setNewStudent(prev => ({ ...prev, email: text }))}
                    />
                    <TextInput
                        className="border border-gray-200 rounded-lg p-3 mb-3 font-rregular"
                        placeholder="Student Age"
                        value={(newStudent.age)?.toString()}
                        onChangeText={(text) => setNewStudent(prev => ({ ...prev, age: parseInt(text) }))}
                        keyboardType='number-pad'
                    />
                    <TextInput
                        className="border border-gray-200 rounded-lg p-3 mb-3 font-rregular"
                        placeholder="Department"
                        value={(newStudent.class)?.toString()}
                        onChangeText={(text) => setNewStudent(prev => ({ ...prev, class: text }))}
                        keyboardType='number-pad'
                    />
                    <View className="border border-gray-200 rounded-lg mb-3 font-rregular">
                        <Picker
                            selectedValue={newStudent.gender}
                            onValueChange={(itemValue: 'male' | 'female') =>
                                setNewStudent({
                                    ...newStudent,
                                    gender: itemValue as 'male' | 'female',
                                })
                            }
                        >
                            <Picker.Item label="Gender" value="" />
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>
                    <TextInput
                        className="border border-gray-200 rounded-lg p-3 mb-3 font-rregular"
                        placeholder="Guardian's Name"
                        value={newStudent.guardianName}
                        onChangeText={(text) => setNewStudent(prev => ({ ...prev, guardianName: text }))}
                    />
                    <TouchableOpacity
                        className="bg-blue-600 p-3 rounded-lg"
                        onPress={handleAddStudent}
                    >
                        <Text className="text-white font-rmedium text-center">Add Student</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
            >
                {renderHeader()}
                {students.length > 0 ? (
                    students.map((student) => <StudentCard key={student._id} {...student} />)
                ) : (
                    <EmptyState />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Students;
