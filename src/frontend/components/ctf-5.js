import { fetchAPI } from '../router.js';

export function initialize() {
    document.getElementById('refreshActivity').addEventListener('click', async () => {
        const endpoint = document.getElementById('monitorEndpoint').value;
        await loadActivity(endpoint);
    });

    async function loadActivity(url) {
        try {
            const response = await fetchAPI(url);
            const result = await response.json();
            const activities = result.data ? result.data : result;

            renderActivities(activities);
        } catch (error) {
            console.error(`Failed to load activity: ${error.message}`);
            document.getElementById('activityFeed').innerHTML = '<div class="p-3 bg-red-50 text-red-500">Failed to load activities</div>';
        }
    }

    function renderActivities(activities) {
        const container = document.getElementById('activityFeed');
        if (!Array.isArray(activities)) {
            if (typeof activities === 'object') activities = JSON.stringify(activities);
            container.innerHTML = `<div class="p-3 bg-gray-50 text-gray-700">${activities}</div>`;
            return;
        }
        container.innerHTML = activities.map(act => `
            <div class="p-3 bg-gray-50 rounded-md border-l-4 ${act.internal ? 'border-red-400' : 'border-blue-400'}">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-sm text-gray-500">
                            ${new Date(act.timestamp).toLocaleString()}
                        </span>
                        <p class="mt-1 text-gray-700">
                            ${act.username}: ${act.content || 'No content'}
                        </p>
                    </div>
                </div>
                ${act.internal ? `<div class="mt-2 text-xs text-red-600">Internal System Status: ${act.status}</div>` : ''}
            </div>
        `).join('');
    }
}
