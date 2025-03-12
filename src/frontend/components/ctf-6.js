const FILE_SERVER = "http://localhost:4000";

export function initialize() {
    console.log('file-server.js initialized');


    document.getElementById('fileForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const filePath = document.getElementById('filePath').value;
        const contentArea = document.getElementById('contentArea');
        const fileContent = document.getElementById('fileContent');
        const errorBox = document.getElementById('errorBox');

        try {
            const response = await fetch(`${FILE_SERVER}/api/files/${filePath}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.text();

            errorBox.innerHTML = '';
            fileContent.classList.remove('hidden');
            contentArea.textContent = content;

        } catch (error) {
            errorBox.innerHTML = `
                <div class="bg-red-50 text-red-800 p-4 rounded-md">
                    Failed to fetch file: ${error.message}
                </div>
            `;
            fileContent.classList.add('hidden');
        }
    });
}
