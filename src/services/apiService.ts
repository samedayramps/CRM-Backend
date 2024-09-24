export const fetchSalesProcesses = async () => {
  try {
    const response = await api.get('/api/sales-processes');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales processes:', error);
    throw error;
  }
};