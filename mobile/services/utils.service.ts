import axios from "axios";

// Helper function for API requests
export const handleApiRequest = async (
  apiCall: () => Promise<any>
): Promise<any> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      return errorData;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
};