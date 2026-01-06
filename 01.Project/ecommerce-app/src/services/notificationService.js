import { http } from './http';

// Obtener todas las notificaciones del usuario
export const getNotifications = async (page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await http.get(`notifications?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    throw error;
  }
};

// Obtener notificaciones no leídas
export const getUnreadNotifications = async () => {
  try {
    const response = await http.get('notifications/unread');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notifications:', error.message);
    throw error;
  }
};

// Marcar una notificación como leída
export const markAsRead = async (notificationId) => {
  try {
    const response = await http.patch(`notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    throw error;
  }
};

// Marcar todas las notificaciones como leídas
export const markAllAsRead = async () => {
  try {
    const response = await http.patch('notifications/read-all');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error.message);
    throw error;
  }
};

// Eliminar una notificación
export const deleteNotification = async (notificationId) => {
  try {
    await http.delete(`notifications/${notificationId}`);
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error.message);
    throw error;
  }
};

// Eliminar todas las notificaciones leídas
export const deleteAllRead = async () => {
  try {
    const response = await http.delete('notifications/delete-read');
    return response.data;
  } catch (error) {
    console.error('Error deleting read notifications:', error.message);
    throw error;
  }
};
