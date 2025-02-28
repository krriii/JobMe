document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      password: document.querySelector('input[name="password"]').value,
      user_type: document.querySelector('select[name="user_type"]').value
    };
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        alert("Your account has been registered successfully!");
        window.location.href = '/api/auth/login';
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Please try again later.");
    }
  });

