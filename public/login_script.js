document.querySelector("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        email: document.querySelector('input[name="email"]').value,
        password: document.querySelector('input[name="password"]').value,
    };

    await loginUser(formData.email, formData.password);
});

async function loginUser(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = data.redirect;
        } else {
            console.error('Login failed:', data.message);
            alert(data.message || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert("An error occurred. Please try again later.");
    }
}

// Example usage to fetch employer dashboard
async function loadEmployerDashboard() {
    try {
        const response = await fetch('/api/auth/dashboard/employer');
        const data = await response.json();
        console.log('Employer Dashboard Data:', data);
    } catch (error) {
        console.error('Error loading employer dashboard:', error);
        alert(error.message || 'Failed to load dashboard');
    }
}

// Example usage to fetch job seeker dashboard
async function loadJobSeekerDashboard() {
    try {
        const response = await fetch('/api/auth/dashboard/jobseeker');
        const data = await response.json();
        console.log('Job Seeker Dashboard Data:', data);
    } catch (error) {
        console.error('Error loading job seeker dashboard:', error);
        alert(error.message || 'Failed to load dashboard');
    }
}

