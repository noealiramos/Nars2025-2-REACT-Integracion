import { http } from './http';

// Obtener todas las direcciones de envío del usuario
export const getShippingAddresses = async () => {
  try {
    const response = await http.get('shipping-addresses');
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping addresses:', error.message);
    throw error;
  }
};

// Obtener una dirección de envío específica
export const getShippingAddressById = async (addressId) => {
  try {
    const response = await http.get(`shipping-addresses/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping address:', error.message);
    throw error;
  }
};

// Crear una nueva dirección de envío
export const createShippingAddress = async (addressData) => {
  try {
    const response = await http.post('shipping-addresses', addressData);
    return response.data;
  } catch (error) {
    console.error('Error creating shipping address:', error.message);
    throw error;
  }
};

// Actualizar una dirección de envío
export const updateShippingAddress = async (addressId, addressData) => {
  try {
    const response = await http.put(`shipping-addresses/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error updating shipping address:', error.message);
    throw error;
  }
};

// Eliminar una dirección de envío
export const deleteShippingAddress = async (addressId) => {
  try {
    await http.delete(`shipping-addresses/${addressId}`);
    return true;
  } catch (error) {
    console.error('Error deleting shipping address:', error.message);
    throw error;
  }
};

// Establecer una dirección como predeterminada
export const setDefaultShippingAddress = async (addressId) => {
  try {
    const response = await http.patch(`shipping-addresses/${addressId}/set-default`);
    return response.data;
  } catch (error) {
    console.error('Error setting default shipping address:', error.message);
    throw error;
  }
};
