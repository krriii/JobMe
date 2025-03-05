// document.querySelector('form').addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const formData = {
//       name: document.querySelector('input[name="name"]').value,
//       email: document.querySelector('input[name="email"]').value,
//       password: document.querySelector('input[name="password"]').value,
//       user_type: document.querySelector('select[name="user_type"]').value
//     };
  
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
  
//       if (response.ok) {
//         alert("Your account has been registered successfully!");
//         window.location.href = '/api/auth/login';
//       } else {
//         alert("Registration failed. Please try again.");
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert("An error occurred. Please try again later.");
//     }
//   });

document.addEventListener('DOMContentLoaded', () => {
  const userTypeSelect = document.querySelector('select[name="user_type"]');
  const employerFields = document.getElementById('employerFields');
  const jobSeekerFields = document.getElementById('jobSeekerFields');

  userTypeSelect.addEventListener('change', () => {
    employerFields.classList.add('hidden');
    jobSeekerFields.classList.add('hidden');

    if (userTypeSelect.value === 'Employer') {
      employerFields.classList.remove('hidden');
    } else if (userTypeSelect.value === 'Job Seeker') {
      jobSeekerFields.classList.remove('hidden');
    }
  });

    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();


        const formData = {
            name: document.querySelector('input[name="name"]').value,
            email: document.querySelector('input[name="email"]').value,
            password: document.querySelector('input[name="password"]').value,
            user_type: document.querySelector('select[name="user_type"]').value,
            // Conditionally add employer/jobseeker fields
            ...(userTypeSelect.value === 'Employer' && {
                company_name: document.querySelector('input[name="company_name"]').value,
                industry: document.querySelector('input[name="industry"]').value,
                location: document.querySelector('input[name="location"]').value,
                website: document.querySelector('input[name="website"]').value
            }),
            ...(userTypeSelect.value === 'Job Seeker' && {
                skills: document.querySelector('input[name="skills"]').value,
                experience: document.querySelector('textarea[name="experience"]').value,
                portfolio_link: document.querySelector('input[name="portfolio_link"]').value
            })
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
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message || "Please try again."}`);

            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Please try again later.");
        }
    });
});

