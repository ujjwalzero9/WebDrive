import { useNavigate } from 'react-router-dom';

async function checkUserCredentials() {
  const navigate = useNavigate();
  const userid = sessionStorage.getItem('userid');
  const keytoken = sessionStorage.getItem('keytoken');

  if (!userid || !keytoken) {
   
    navigate('/login');
    return false; // User is not valid
  }


  try {
    const response = await fetch('http://127.0.0.1:8000/api/validate-credentials/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid, keytoken }),
    });

    if (response.status === 200) {
      // User credentials are valid
      return true;
    } else {
      
      navigate('/login');
      return false;
    }
  } catch (error) {
    // Handle API request error
    console.error('API request error:', error);
    // You can redirect or handle this error as needed
    return false;
  }
}

export default checkUserCredentials;
