import { fetchAPI } from '../router.js';

export function initialize() {
    console.log('ctf-2.js initialized');

    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const resultsArea = document.getElementById('resultsArea');
        const resultsBody = document.getElementById('resultsBody');
        const errorBox = document.getElementById('errorBox');

        try {
            const response = await fetchAPI('/api/accounts/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();

            if (data.error) {
                errorBox.innerHTML = `
                <div class="bg-red-50 text-red-800 p-4 rounded-md">
                    ${data.error}
                </div>
            `;
                resultsArea.classList.add('hidden');
            } else {
                errorBox.innerHTML = '';
                resultsArea.classList.remove('hidden');
                resultsBody.innerHTML = data.map(account => `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${account.username}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${account.account_number}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        €${account.balance.toLocaleString()}
                    </td>
                </tr>
            `).join('');
            }
        } catch (error) {
            errorBox.innerHTML = `
            <div class="bg-red-50 text-red-800 p-4 rounded-md">
                Search failed: ${error.message}
            </div>
        `;
            resultsArea.classList.add('hidden');
        }
    });
}
