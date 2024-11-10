import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { config } from '@/config';
import { getToken, logout } from '@/utils';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { FLUTTERWAVE_SECRET_KEY } from '@env';

interface SchoolFee {
    _id: string;
    className: string;
    amount: number;
    dueDate: string;
    term: string;
    description: string;
    paid: Array<string>;
}

const PaymentCard: React.FC<SchoolFee & { onPayNow: () => void } & { userId: string }> = ({
    className, amount, dueDate, term, description, paid, onPayNow, userId
}) => {
    const formattedDate = new Date(dueDate).toLocaleDateString();
    const isOverdue = new Date(dueDate) < new Date();

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800 font-rsemibold text-lg">{className}</Text>
                <View className={`px-3 py-1 rounded-full ${isOverdue ? 'bg-red-100' : 'bg-green-100'}`}>
                    <Text className={`${isOverdue ? 'text-red-600' : 'text-green-600'} font-rmedium`}>
                        {isOverdue ? 'Overdue' : 'Active'}
                    </Text>
                </View>
            </View>
            <Text className="text-2xl font-rbold text-blue-600">₦{amount.toLocaleString()}</Text>
            <Text className="text-gray-600 mb-2 font-rregular">{description}</Text>
            <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-sm font-rregular">Due: {formattedDate}</Text>
                <Text className="text-gray-500 text-sm font-rmedium">{term}</Text>
            </View>
            <TouchableOpacity
                className={`p-3 rounded-lg mt-3 ${paid.includes(userId) ? 'bg-blue-600/20' : 'bg-blue-600'}`}
                onPress={onPayNow}
                disabled={paid.includes(userId)}
            >
                <Text className="text-white font-rmedium text-center">{paid.includes(userId) ? 'Paid' : 'Pay Now'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-8">
        <Ionicons name="cash-outline" size={64} color="#9CA3AF" />
        <Text className="text-gray-500 font-rmedium text-lg mt-4">No school fees due</Text>
        <Text className="text-gray-400 font-rregular text-center mt-2">
            All your school fees are paid up to date
        </Text>
    </View>
);

const ParentPayments = () => {
    const [schoolFees, setSchoolFees] = useState<SchoolFee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<any>(null);

    const fetchUserDetails = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`${config.BASE_API_URL}/api/auth/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setUserDetails(response.data);
        } catch (error: any) {
            if (error.response?.data?.message === "Unauthorized") {
                await logout();
            }
            Alert.alert('Error', 'Failed to fetch user details');
        }
    };

    const fetchSchoolFees = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get(`${config.BASE_API_URL}/api/school-fees/child`, {
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
        fetchUserDetails();
        fetchSchoolFees();
    }, []);

    const verifyPayment = async (transactionId: string, transactionRef: string, feeId: string) => {
        try {
            const token = await getToken();
            const response = await axios.get(
                `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
                {
                    headers: {
                        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                    },
                }
            );

            if (response.data.status === 'success' &&
                response.data.data.status === 'successful' &&
                response.data.data.amount >= response.data.data.charged_amount) {

                await axios.post(
                    `${config.BASE_API_URL}/api/payments/save/${feeId}`,{},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                Alert.alert('Success', 'Payment completed successfully');
                fetchSchoolFees();
            } else {
                Alert.alert('Error', 'Payment verification failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to verify payment. Please contact support.');
        }
    };

    const handlePayment = async (fee: SchoolFee) => {
        try {
            const txRef = `PRE_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

            const response = await axios.post(
                'https://api.flutterwave.com/v3/payments',
                {
                    tx_ref: txRef,
                    amount: fee.amount,
                    currency: 'NGN',
                    redirect_url: 'redirect-url',
                    payment_options: 'card,ussd',
                    customer: {
                        email: userDetails.email,
                        name: userDetails.name,
                        phonenumber: userDetails.phone || '',
                    },
                    customizations: {
                        title: 'School Fee Payment',
                        description: `Payment for ${fee.description}`,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.data.link) {
                await Linking.openURL(response.data.data.link);

                if (response.data.data.transaction_id) {
                    await verifyPayment(response.data.data.transaction_id, txRef, fee._id);
                }
            }
        } catch (error: any) {
            console.log(error.response.data);
            Alert.alert('Error', error.response?.data?.error || 'Failed to initiate payment');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4">
                <View className="flex-row justify-between items-center py-4">
                    <Text className="text-xl font-rbold text-gray-800">School Fees</Text>
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center py-8">
                        <Text className="text-gray-500 font-rregular">Loading...</Text>
                    </View>
                ) : schoolFees.length > 0 ? (
                    schoolFees.map((fee) => (
                        <PaymentCard
                            key={fee._id}
                            {...fee}
                            onPayNow={() => handlePayment(fee)}
                            userId={userDetails._id}
                        />
                    ))
                ) : (
                    <EmptyState />
                )}

                <View className="mb-[100px]" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ParentPayments;
