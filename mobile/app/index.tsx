import { Text, View, Image } from "react-native";
import React from "react";
import AppLayout from "@/components/common/AppLayout";
import { Dimensions } from "react-native";
import { Button } from "@/components/common/Button";
import { useRouter } from "expo-router";
import useAuth from "@/context/auth/AuthProvider";

const index = () => {
  const { height: h } = Dimensions.get("screen");
  const router = useRouter();
  const { user } = useAuth();
  return (
    <AppLayout>
      <View className="justify-center items-center py-20">
        <View
          className="w-[70%] bg-[#98A8B8] rounded-lg overflow-hidden"
          style={{ height: h * 0.4 }}
        >
          <Image
            source={require("@/assets/images/onboarding.jpg")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>
      <View className="justify-center items-center gap-4">
        {user ? (
          <Text className="font-senExtraBold font-extrabold text-2xl">
            Welcome Back {user?.username}
          </Text>
        ) : (
          <Text className="font-senExtraBold font-extrabold text-2xl">
            Free delivery offers
          </Text>
        )}
        {user ? <Text className="font-senRegular font-normal text-base text-[#646982] text-center px-2">
          Continue enjoying our services and get the best deals, continue to home
        </Text>:<Text className="font-senRegular font-normal text-base text-[#646982] text-center px-2">
          Get all your loved foods in one once place, you just place the orer we
          do the rest
        </Text>}
      </View>
      {/* Button container */}
      <View className="flex-1 justify-center">
        {user ? (
          <Button
            title="Go to Home"
            onPress={() => router.push("/(tabs)/home/homeScreen")}
          />
        ) : (
          <Button
            title="Get Started"
            onPress={() => router.push("/(auth)/signup")}
          />
        )}
      </View>
    </AppLayout>
  );
};

export default index;
