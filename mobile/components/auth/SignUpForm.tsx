import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FormInput from "../common/Input";
import useValidate, { ValidationRules } from "@/hooks/useValidate";
import { Button } from "../common/Button";
import { useRegister } from "@/hooks/useAuth";
import { useToast } from "react-native-toast-notifications";

interface IRegisterForm {
  className?: string;
}

const RegisterForm = ({ className }: IRegisterForm) => {
  const navigate = useRouter();
  const registerMutation = useRegister();
  const toast = useToast();
  const router = useRouter();
  const { validate } = useValidate();
  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const validationSchema: ValidationRules = {
    username: {
      type: "string" as const,
      required: true,
      minLength: 3,
      message: "Username must be at least 3 characters",
    },
    email: {
      type: "email" as const,
      required: true,
      message: "Please enter a valid email address",
    },
    password: {
      type: "string" as const,
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters",
    },
  };

  const validateField = (name: string, value: string) => {
    const fieldSchema = { [name]: validationSchema[name] };
    const fieldData = { [name]: value };
    const { errors } = validate(fieldData, fieldSchema);
    setError((prev) => ({
      ...prev,
      [name]: errors[name] || "",
    }));
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleRegister = () => {
    const { isValid, errors } = validate(formData, validationSchema);
    setError({
      username: errors.username || "",
      email: errors.email || "",
      password: errors.password || "",
    });

    if (isValid) {
      registerMutation.mutateAsync(
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: (response: any) => {
            if (response.success) {
              toast.show(response.message, { type: "success" });
              router.push("/(auth)/login");
            }else{
              toast.show(response.message, { type: "danger" });
            }
          },
          onError: () => {
            toast.show("failed to register", { type: "danger" });
          },
        }
      );
    }
  };

  return (
    <View className={`${className} flex flex-col gap-4`}>
      <FormInput
        label="Username"
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)}
        errorMessage={error.username}
      />
      <FormInput
        label="Email"
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        errorMessage={error.email}
      />
      <FormInput
        label="Password"
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
        secureTextEntry
        isPassword
        errorMessage={error.password}
      />
      <View className="py-3">
        <Button
          title="Register"
          onPress={handleRegister}
          isLoading={registerMutation.isPending}
        />
      </View>
      <View className="flex-row justify-center items-center">
        <Text className="text-base text-center font-senRegular">
          Already have an account?{"  "}
        </Text>
        <TouchableOpacity onPress={() => navigate.push("/(auth)/login")}>
          <Text className="text-base text-center font-senRegular uppercase text-primary">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;
