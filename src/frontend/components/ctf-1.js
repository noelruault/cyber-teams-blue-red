import { fetchAPI } from '../router.js';

export function initialize() {
    console.log('ctf-1.js initialized');

    document.getElementById('pingForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const host = document.getElementById('host').value;
        const responseArea = document.getElementById('responseArea');
        const output = document.getElementById('output');
        const errorBox = document.getElementById('errorBox');

        try {
            const response = await fetchAPI('/api/ping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ host })
            });

            const data = await response.json();
            console.log(data);

            if (data.error) {
                errorBox.innerHTML = `
                <div class="bg-red-50 text-red-800 p-4 rounded-md">
                    ${data.error}
                </div>
            `;
                responseArea.classList.add('hidden');
            } else {
                errorBox.innerHTML = '';
                responseArea.classList.remove('hidden');
                output.textContent = data.output || 'No output received';
            }
        } catch (error) {
            errorBox.innerHTML = `
                <div class="bg-red-50 text-red-800 p-4 rounded-md">
                    Request failed: ${error.message}
                </div>
            `;
            responseArea.classList.add('hidden');
        }
    });

}
