import axios from "axios";

const BASE_URL = "https://cardbillapi.onrender.com/";

// Set up Axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Sign-up API call
export const signUp = async (
  email: string,
  fullName: string,
  password: string,
) => {
  try {
    const response = await api.post("api/v1/auth/register", {
      email,
      full_name: fullName,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      throw error.response.data.detail;
    }
    throw "An error occurred";
  }
};

// Login API call
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("api/v1/auth/login", {
      email,
      password,
    });
    return response.data; // Expects token in response (access_token, token_type)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      throw error.response.data.detail; // Display the error message from the backend
    }
    throw "An error occurred"; // General error message
  }
};

// Helper function to get the auth token from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {}; // Add token to headers if available
};

// Fetch protected data
export const fetchProtectedData = async () => {
  try {
    const response = await api.get("api/v1/protected-endpoint", {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching protected data", error);
    throw "Error fetching protected data";
  }
};
// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const response = await api.get("api/v1/users/profile", {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile", error);
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      throw error.response.data.detail;
    }
    throw "Error fetching user profile";
  }
};

export const getGiftCards = async (
  skip = 0,
  limit = 100,
  activeOnly = true,
) => {
  try {
    const response = await api.get(`/api/v1/gift-cards/`, {
      params: { skip, limit, active_only: activeOnly },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching gift cards:", error);
    throw error;
  }
};

export const getGiftCardById = async (giftCardId: string) => {
  try {
    const response = await api.get(`/api/v1/gift-cards/${giftCardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gift card:", error);
    throw error;
  }
};

export const getGiftCardTransactions = async (skip = 0, limit = 100) => {
  try {
    const response = await api.get(`/api/v1/gift-cards/transactions/`, {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching gift card transactions:", error);
    throw error;
  }
};

export const createGiftCardTransaction = async (data: {
  gift_card_id: string;
  transaction_type: string;
  amount: number;
  price: number;
  card_code: string;
  card_pin: string;
  card_image_url: string;
  notes: string;
}, headers: { Authorization: string; }) => {
  try {
    const response = await api.post(`/api/v1/gift-cards/transactions/`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating gift card transaction:", error);
    throw error;
  }
};

export const uploadGiftCardImage = async (file: FormData) => {
  try {
    const response = await api.post(
      `/api/v1/gift-cards/transactions/upload-card-image`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading gift card image:", error);
    throw error;
  }
};

export const getGiftCardTransactionById = async (transactionId: string) => {
  try {
    const response = await api.get(
      `/api/v1/gift-cards/transactions/${transactionId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching specific gift card transaction:", error);
    throw error;
  }
};

export const updateGiftCardTransaction = async (
  transactionId: string,
  data: { status?: string; notes?: string },
) => {
  try {
    const response = await api.put(
      `/api/v1/gift-cards/transactions/${transactionId}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating gift card transaction:", error);
    throw error;
  }
};

export const getWithdrawals = async (skip: number = 0, limit: number = 100) => {
  try {
    const response = await api.get(`/withdrawals`, {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new withdrawal request
export const createWithdrawal = async (
  amount: number,
  method: string,
  account_details: string,
) => {
  try {
    const response = await api.post("/withdrawals", {
      amount,
      method,
      account_details,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a specific withdrawal by ID
export const getWithdrawalById = async (withdrawalId: string) => {
  try {
    const response = await api.get(`/withdrawals/${withdrawalId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a withdrawal request
export const updateWithdrawal = async (
  withdrawalId: string,
  status: string,
  notes: string,
) => {
  try {
    const response = await api.put(`/withdrawals/${withdrawalId}`, {
      status,
      notes,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Chat Support Endpoints ---

// Get user's chat messages
export const getChatMessages = async (
  skip: number = 0,
  limit: number = 100,
) => {
  try {
    const response = await api.get("/chat/messages", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new chat message
export const createChatMessage = async (
  message: string,
  attachment_url?: string,
) => {
  try {
    const response = await api.post("/chat/messages", {
      message,
      attachment_url,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (messageIds: string[]) => {
  try {
    const response = await api.post("/chat/messages/mark-as-read", messageIds);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- VTU Transactions Endpoints ---

// Get a list of user's VTU transactions
export const getVtuTransactions = async (
  skip: number = 0,
  limit: number = 100,
) => {
  try {
    const response = await api.get("/vtu/transactions", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new VTU transaction
export const createVtuTransaction = async (
  service_type: string,
  provider: string,
  recipient: string,
  amount: number,
) => {
  try {
    const response = await api.post("/vtu/transactions", {
      service_type,
      provider,
      recipient,
      amount,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a specific VTU transaction by ID
export const getVtuTransactionById = async (transactionId: string) => {
  try {
    const response = await api.get(`/vtu/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Get list of users with pagination
export const getUsers = async (skip: number = 0, limit: number = 100) => {
  try {
    const response = await api.get("/admin/users", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new admin user
export const createAdminUser = async (
  email: string,
  full_name: string,
  password: string,
  is_active: boolean = true,
  is_admin: boolean = true,
) => {
  try {
    const response = await api.post("/admin/users", {
      email,
      full_name,
      password,
      is_active,
      is_admin,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a specific user by ID
export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`api/v1/admin/users/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user", error);
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      throw error.response.data.detail;
    }
    throw "Error fetching user";
  }
};

export default api;
