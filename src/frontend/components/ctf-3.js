import { fetchAPI } from '../router.js';

export function initialize() {
    console.log('ctf-3.js initialized');

    document.getElementById('createForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('newUsername').value;
        const balance = document.getElementById('newBalance').value;
        const messageBox = document.getElementById('createMessage');

        try {
            const response = await fetchAPI('/api/accounts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, balance })
            });

            const data = await response.json();

            if (data.success) {
                messageBox.innerHTML = `
                    <div class="bg-green-50 text-green-800 p-4 rounded-md">
                        Account created ${data.account.username}! Your account number: ${data.account.accountNumber}
                    </div>
                `;
                e.target.reset();
            } else {
                messageBox.innerHTML = `
                    <div class="bg-red-50 text-red-800 p-4 rounded-md">
                        ${data.error}
                    </div>
                `;
            }
        } catch (error) {
            messageBox.innerHTML = `
                <div class="bg-red-50 text-red-800 p-4 rounded-md">
                    Creation failed: ${error.message}
                </div>
            `;
        }
    })
}
