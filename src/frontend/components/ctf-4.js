import { fetchAPI } from '../router.js';

export function initialize() {
    console.log('ctf-4.js initialized');

    let currentBalance = 0;

    async function updateBankInfo() {
        try {
            const response = await fetchAPI('/api/bank-info');
            const data = await response.json();

            currentBalance = data.balance;
            document.getElementById('balanceDisplay').textContent = `Balance: €${data.balance.toLocaleString()}`;

            const historyHTML = data.transactions.map(t => `
                <div class="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                    ${t}
                </div>
            `).join('');
            document.getElementById('history').innerHTML = historyHTML || 'No transactions';
        } catch (error) {
            console.error('Failed to fetch bank info:', error);
        }
    }

    // Initialize the page
    updateBankInfo();

    // Handle form submission
    document.getElementById('transferForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const messageBox = document.getElementById('messageBox');

        try {
            const response = await fetchAPI('/api/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: form.to.value,
                    amount: form.amount.value
                })
            });

            const data = await response.json();

            if (data.error) {
                messageBox.innerHTML = `
                    <div class="bg-red-50 text-red-800 p-4 rounded-md">
                        ${data.error}
                    </div>
                `;
            } else {
                messageBox.innerHTML = `
                    <div class="bg-green-50 text-green-800 p-4 rounded-md">
                        Transfer successful!
                    </div>
                `;
                form.reset();
                await updateBankInfo();
            }
        } catch (error) {
            messageBox.innerHTML = `
                <div class="bg-red-50 text-red-800 p-4 rounded-md">
                    Transaction failed. Please try again.
                </div>
            `;
        }
    });
}
