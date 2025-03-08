import axios from 'axios';

export async function getUser(params = {}) {
  try {
    const response = await axios.get('/api/user');
    // console.log('ResⓂ️', response);

    // If any key is passed in `params`, return its corresponding value
    const [key] = Object.keys(params); // Extract the key from the passed object
    if (key) {
      return response.data[key]; // Dynamically return the value for the passed key
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getUsers(role) {
  try {
    const endpoint = role ? `/api/users?role=${role}` : `/api/users`;

    const response = await axios.get(endpoint);
    // console.log('🔥', response.data);

    // Handle success
    // console.log('Users are💕:', response.data);
    return response.data;
  } catch (error) {
    // Handle error
    if (error.response) {
      console.error('Error:', error.response.data.error);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something went wrong in setting up the request
      console.error('Axios error:', error.message);
    }
    return null;
  }
}
