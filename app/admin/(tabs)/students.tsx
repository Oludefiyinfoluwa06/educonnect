import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Student {
    id: string;
    name: string;
    email: string;
    class: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SSS 1' | 'SSS 2' | 'SSS 3';
    studentId: string;
    age: number;
    gender: 'male' | 'female';
    guardianName: string;
}

const StudentCard: React.FC<Student> = ({ name, class: studentClass, studentId }) => (
    <TouchableOpacity
        className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row justify-between items-center"
        onPress={() => {
            router.push(`../(screens)/students/[studentId]`);
        }}
    >
        <View>
            <Text className="text-gray-800 font-rsemibold">{name}</Text>
            <Text className="text-gray-600 font-rregular">{studentClass}</Text>
        </View>
        <View>
            <Text className="text-gray-500 text-sm font-rregular">{studentId}</Text>
            <Ionicons name="chevron-forward" size={20} color="#4B5563" />
        </View>
    </TouchableOpacity>
);

const Students = () => {
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [newStudent, setNewStudent] = useState<Partial<Student>>({});

    const dummyStudents: Student[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@johnson.com',
            class: 'JSS 2',
            studentId: '2023/001',
            age: 13,
            gender: 'female',
            guardianName: 'Mr. & Mrs. Johnson'
        },
        {
            id: '2',
            name: 'Michael Davis',
            email: 'michael@davis.com',
            class: 'SSS 1',
            studentId: '2022/012',
            age: 15,
            gender: 'male',
            guardianName: 'Mr. & Mrs. Davis'
        },
        {
            id: '3',
            name: 'Emily Williams',
            email: 'emily@williams.com',
            class: 'JSS 1',
            studentId: '2023/045',
            age: 12,
            gender: 'female',
            guardianName: 'Mrs. Williams'
        }
    ];

    const handleAddStudent = () => {
        if (!newStudent.name || !newStudent.class || !newStudent.studentId) {
            alert('Please fill in all required fields');
            return;
        }

        console.log('Adding new student:', newStudent);
        setNewStudent({});
        setShowAddStudentForm(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
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
                        />
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3 mb-3 font-rregular"
                            placeholder="Class"
                            value={newStudent.class}
                            onChangeText={(text) => {
                                const validClasses = ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'];
                                if (validClasses.includes(text)) {
                                    setNewStudent(prev => ({ ...prev, class: text as 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SSS 1' | 'SSS 2' | 'SSS 3' }));
                                } else {
                                    alert('Please enter a valid class (JSS 1, JSS 2, JSS 3, SSS 1, SSS 2, or SSS 3)');
                                }
                            }}
                        />
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3 mb-3 font-rregular"
                            placeholder="Student ID"
                            value={newStudent.studentId}
                            onChangeText={(text) => setNewStudent(prev => ({ ...prev, studentId: text }))}
                        />
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

                <FlatList
                    data={dummyStudents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <StudentCard {...item} />}
                />

                <View className="mb-[100px]" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Students;
