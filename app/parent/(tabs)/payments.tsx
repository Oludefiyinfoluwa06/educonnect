import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

interface Payment {
    id: string;
    className: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SSS 1' | 'SSS 2' | 'SSS 3';
    amount: number;
    paymentDate: string;
    status: 'paid' | 'pending' | 'overdue';
}

const PaymentCard: React.FC<Payment> = ({ className, amount, paymentDate, status }) => {
    const statusColors = {
        paid: 'bg-green-100 text-green-600',
        pending: 'bg-yellow-100 text-yellow-600',
        overdue: 'bg-red-100 text-red-600',
    };

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800 font-rsemibold text-lg">{className}</Text>
                <View className={`px-3 py-1 rounded-full ${statusColors[status].split(' ')[0]}`}>
                    <Text className={`${statusColors[status].split(' ')[1]} font-rmedium capitalize`}>
                        {status}
                    </Text>
                </View>
            </View>
            <Text className="text-2xl font-rbold text-blue-600">₦{amount.toLocaleString()}</Text>
            <Text className="text-gray-500 mt-1 font-rregular">Paid on: {paymentDate}</Text>
        </View>
    );
}

const ParentPayments = () => {
    const [payments, setPayments] = useState<Payment[]>([
        {
            id: '1',
            className: 'JSS 1',
            amount: 150000,
            paymentDate: 'March 15, 2024',
            status: 'paid',
        },
        {
            id: '2',
            className: 'JSS 2',
            amount: 120000,
            paymentDate: 'February 28, 2024',
            status: 'pending',
        },
        {
            id: '3',
            className: 'SSS 1',
            amount: 180000,
            paymentDate: 'January 31, 2024',
            status: 'overdue',
        },
    ]);

    const [newPayment, setNewPayment] = useState<{
        class: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SSS 1' | 'SSS 2' | 'SSS 3';
        amount: number;
        paymentDate: string;
    }>({
        class: 'JSS 1',
        amount: 0,
        paymentDate: '',
    });

    const makePayment = () => {
        console.log('New Payment:', newPayment);
        setNewPayment({ class: 'JSS 1', amount: 0, paymentDate: '' });
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="flex-row justify-between items-center py-4">
                    <Text className="text-xl font-rbold text-gray-800">My Payments</Text>
                    <TouchableOpacity
                        className="bg-blue-600 px-4 py-2 rounded-full"
                        onPress={() => setNewPayment({ class: 'JSS 1', amount: 0, paymentDate: '' })}
                    >
                        <Text className="text-white font-rmedium">Make Payment</Text>
                    </TouchableOpacity>
                </View>

                {newPayment.amount > 0 && (
                    <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
                        <Text className="text-gray-800 font-rsemibold text-lg mb-2">
                            New Payment
                        </Text>
                        <Picker
                            className="mb-3"
                            selectedValue={newPayment.class}
                            onValueChange={(itemValue: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SSS 1' | 'SSS 2' | 'SSS 3') =>
                                setNewPayment({
                                    ...newPayment,
                                    class: itemValue as 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SSS 1' | 'SSS 2' | 'SSS 3',
                                })
                            }
                        >
                            <Picker.Item label="JSS 1" value="JSS 1" />
                            <Picker.Item label="JSS 2" value="JSS 2" />
                            <Picker.Item label="JSS 3" value="JSS 3" />
                            <Picker.Item label="SSS 1" value="SSS 1" />
                            <Picker.Item label="SSS 2" value="SSS 2" />
                            <Picker.Item label="SSS 3" value="SSS 3" />
                        </Picker>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-2 mb-3 font-rregular"
                            placeholder="Enter Amount"
                            value={newPayment.amount.toString()}
                            onChangeText={(text) =>
                                setNewPayment({
                                    ...newPayment,
                                    amount: parseFloat(text),
                                })
                            }
                            keyboardType="numeric"
                        />
                        <TextInput
                            className="border border-gray-200 rounded-lg p-2 font-rregular"
                            placeholder="Payment Date"
                            value={newPayment.paymentDate}
                            onChangeText={(text) =>
                                setNewPayment({
                                    ...newPayment,
                                    paymentDate: text,
                                })
                            }
                        />
                        <TouchableOpacity
                            className="bg-blue-600 p-3 rounded-lg mt-3"
                            onPress={makePayment}
                        >
                            <Text className="text-white font-rmedium text-center">
                                Submit Payment
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {payments.map((payment) => (
                    <PaymentCard key={payment.id} {...payment} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default ParentPayments;
