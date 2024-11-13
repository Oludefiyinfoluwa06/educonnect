import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { config } from '@/config';
import { getToken, logout } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

interface SchoolFee {
    _id: string;
    amount: number;
    dueDate: string;
    description: string;
}

const TERMS = ['First Term', 'Second Term', 'Third Term'];

const SchoolFeeCard: React.FC<SchoolFee & { onEdit: (fee: SchoolFee) => void }> = ({
    _id, amount, dueDate, description, onEdit
}) => {
    const formattedDate = new Date(dueDate).toLocaleDateString();
    const isOverdue = new Date(dueDate) < new Date();

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => onEdit({ _id, amount, dueDate, description })}
                        className="mr-2"
                    >
                        <Ionicons name="pencil" size={20} color="#4B5563" />
                    </TouchableOpacity>
                    <View className={`px-3 py-1 rounded-full ${isOverdue ? 'bg-red-100' : 'bg-green-100'}`}>
                        <Text className={`${isOverdue ? 'text-red-600' : 'text-green-600'} font-rmedium`}>
                            {isOverdue ? 'Overdue' : 'Active'}
                        </Text>
                    </View>
                </View>
            </View>
            <Text className="text-gray-800 font-rmedium text-lg">₦{amount.toLocaleString()}</Text>
            <Text className="text-gray-600 mb-2 font-rregular">{description}</Text>
            <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-sm font-rregular">Due: {formattedDate}</Text>
            </View>
        </View>
    );
}

const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-8">
        <Ionicons name="cash-outline" size={64} color="#9CA3AF" />
        <Text className="text-gray-500 font-rmedium text-lg mt-4">No school fees set</Text>
        <Text className="text-gray-400 font-rregular text-center mt-2">
            Add school fees by clicking the 'Add School Fee' button above
        </Text>
    </View>
);

const SchoolFees = () => {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [schoolFees, setSchoolFees] = useState<SchoolFee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const resetForm = () => {
        setAmount('');
        setDescription('');
        setDueDate(new Date());
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const fetchSchoolFees = async () => {
        setLoading(true);

        try {
            const token = await getToken();
            const response = await axios.get(`${config.BASE_API_URL}/api/school-fees`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setSchoolFees(response.data);
        } catch (error: any) {
            if (error.response?.data?.message === "Unauthorized") {
                await logout();
            }

            Alert.alert('Error', error.response?.data?.error || 'Failed to fetch school fees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchoolFees();
    }, []);

    const handleEdit = (fee: SchoolFee) => {
        setIsEditing(true);
        setEditingId(fee._id);
        setAmount(fee.amount.toString());
        setDescription(fee.description);
        setDueDate(new Date(fee.dueDate));
        setShowForm(true);
    };

    const handleUpdate = async () => {
        setLoading(true);

        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            setLoading(false);
            return;
        }

        try {
            const token = await getToken();
            await axios.put(
                `${config.BASE_API_URL}/api/school-fees/${editingId}`,
                {
                    amount: Number(amount),
                    dueDate: dueDate.toISOString(),
                    description
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            resetForm();
            fetchSchoolFees();
            Alert.alert('Success', 'School fee updated successfully');
        } catch (error: any) {
            if (error.response?.data?.message === "Unauthorized") {
                await logout();
            }

            Alert.alert('Error', error.response?.data?.error || 'Failed to update school fee');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSchoolFee = async () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        try {
            const token = await getToken();
            await axios.post(`${config.BASE_API_URL}/api/school-fees`, {
                amount: Number(amount),
                dueDate: dueDate.toISOString(),
                description
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            resetForm();
            fetchSchoolFees();
        } catch (error: any) {
            if (error.response?.data?.message === "Unauthorized") {
                await logout();
            }
            Alert.alert('Error', error.response?.data?.error || 'Failed to create school fee');
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row justify-between items-center py-4">
                    <Text className="text-xl font-rbold text-gray-800">School Fees</Text>
                    {!isEditing && (
                        <TouchableOpacity
                            className="bg-blue-600 px-4 py-2 rounded-full"
                            onPress={() => setShowForm(!showForm)}
                        >
                            <Text className="text-white font-rmedium">
                                {showForm ? 'Close Form' : 'Add School Fee'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {showForm && (
                    <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
                        {isEditing ? (
                            <>
                                <View className="mb-4">
                                    <Text className="text-lg font-rsemibold text-gray-800 mb-2">
                                        Editing fee
                                    </Text>
                                </View>

                                <TextInput
                                    className="border border-gray-200 rounded-lg p-2 mb-3 font-rregular"
                                    placeholder="Amount (₦)"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    className="border border-gray-200 rounded-lg p-2 mb-3 font-rregular"
                                    placeholder="Description (e.g. First Term Fees 2024/2025)"
                                    value={description}
                                    onChangeText={setDescription}
                                />

                                <TouchableOpacity
                                    className="border border-gray-200 rounded-lg p-2 mb-3"
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text className="font-rregular text-gray-600">
                                        {`Due Date: ${dueDate.toLocaleDateString()}` || 'Select a due date'}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-2 mb-3 font-rregular"
                                    placeholder="Amount (₦)"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    className="border border-gray-200 rounded-lg p-2 mb-3 font-rregular"
                                    placeholder="Description"
                                    value={description}
                                    onChangeText={setDescription}
                                />

                                <TouchableOpacity
                                    className="border border-gray-200 rounded-lg p-2 mb-3"
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text className="font-rregular text-gray-600">
                                        {`Due Date: ${dueDate.toLocaleDateString()}` || 'Select a due date'}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {showDatePicker && (
                            <DateTimePicker
                                value={dueDate}
                                mode="date"
                                display="default"
                                onChange={(event: any, selectedDate: any) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setDueDate(selectedDate);
                                    }
                                }}
                                minimumDate={new Date()}
                            />
                        )}

                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                className="bg-gray-500 p-3 rounded-lg flex-1 mr-2"
                                onPress={resetForm}
                            >
                                <Text className="text-white font-rmedium text-center">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-blue-600 p-3 rounded-lg flex-1 ml-2"
                                onPress={isEditing ? handleUpdate : handleCreateSchoolFee}
                            >
                                <Text className="text-white font-rmedium text-center">
                                    {isEditing ? 'Update School Fee' : loading ? 'Loading...' : 'Add School Fee'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {schoolFees.length > 0 ? (
                    schoolFees.map((fee) => (
                        <SchoolFeeCard
                            key={fee._id}
                            {...fee}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    <EmptyState />
                )}

                <View className="mb-[100px]" />
            </ScrollView>
        </SafeAreaView>
    );
}

export default SchoolFees;
