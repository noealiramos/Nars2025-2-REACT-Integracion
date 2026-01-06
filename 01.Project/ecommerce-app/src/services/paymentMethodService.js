import { http } from './http';

// Obtener todos los métodos de pago del usuario
export const getPaymentMethods = async () => {
  try {
    const response = await http.get('payment-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error.message);
    throw error;
  }
};

// Obtener un método de pago específico
export const getPaymentMethodById = async (paymentMethodId) => {
  try {
    const response = await http.get(`payment-methods/${paymentMethodId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment method:', error.message);
    throw error;
  }
};

// Crear un nuevo método de pago
export const createPaymentMethod = async (paymentData) => {
  try {
    const response = await http.post('payment-methods', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment method:', error.message);
    throw error;
  }
};

// Actualizar un método de pago
export const updatePaymentMethod = async (paymentMethodId, paymentData) => {
  try {
    const response = await http.put(`payment-methods/${paymentMethodId}`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error updating payment method:', error.message);
    throw error;
  }
};

// Eliminar un método de pago
export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    await http.delete(`payment-methods/${paymentMethodId}`);
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error.message);
    throw error;
  }
};

// Establecer un método de pago como predeterminado
export const setDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await http.patch(`payment-methods/${paymentMethodId}/set-default`);
    return response.data;
  } catch (error) {
    console.error('Error setting default payment method:', error.message);
    throw error;
  }
};
