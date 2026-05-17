/* ==========================================================================
   LOGIN PAGE — Password show/hide toggle and form submit (mock login).
   ========================================================================== */

        /* Click the eye button to switch password field between hidden and visible. */
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleBtn.textContent = isPassword ? '🙈' : '👁';
        });

        /* On submit: if email/password match mock credentials, show welcome alert;
           otherwise show the error message element. */
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            if (email && password) {
                const submitBtn = document.querySelector('.btn-login');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'LOGGING IN...';
                submitBtn.disabled = true;

                // Replit Backend URL
                const API_BASE_URL = 'https://fullstack-project--moaz2422007.replit.app';

                fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                })
                .then(response => response.json())
                .then(data => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    if (data.success) {
                        errorMsg.classList.remove('show');
                        alert('✅ Welcome back to Football Cave!');
                        localStorage.setItem('token', data.data.token);
                        localStorage.setItem('user', JSON.stringify(data.data));
                        // window.location.href = '../index.html'; // Redirect to home page
                    } else {
                        errorMsg.textContent = '⚠ ' + (data.message || 'Invalid email or password');
                        errorMsg.classList.add('show');
                    }
                })
                .catch(error => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    errorMsg.textContent = '⚠ Network error, please ensure the backend is running.';
                    errorMsg.classList.add('show');
                    console.error('Error:', error);
                });
            } else {
                errorMsg.classList.add('show');
            }
        });