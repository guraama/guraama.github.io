// main.js

// Function to fetch activities data
async function getActivitiesData() {
    // In a real scenario, you might fetch this from an API.
    // For now, it's directly from data.js
    return activitiesData; // activitiesData is defined in data.js
}

// --- Logic for activities.html (List Page) ---
async function renderActivitiesList() {
    const activitiesContainer = document.getElementById('activities-container');
    const paginationContainer = document.getElementById('pagination-container');
    if (!activitiesContainer || !paginationContainer) return; // Ensure we are on the activities list page

    const activities = await getActivitiesData();
    const itemsPerPage = 4; // Number of activities per page
    let currentPage = 1;

    function displayActivities(page) {
        activitiesContainer.innerHTML = ''; // Clear previous activities
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedActivities = activities.slice(start, end);

        if (paginatedActivities.length === 0) {
            activitiesContainer.innerHTML = '<p class="text-center text-gray-600 text-xl py-10">No activities to display.</p>';
            return;
        }

        paginatedActivities.forEach(activity => {
            const activityCard = `
                <div class="bg-white p-6 rounded-lg hover:shadow-sm transition duration-300 transform hover:bg-gray-50 hover:-translate-y-1 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <img src="${activity.image}" alt="${activity.heading}" class="w-full md:w-48 h-32 object-cover rounded-md flex-shrink-0">
                    <div class="flex-grow text-center md:text-left">
                        <h3 class="text-xl font-semibold text-blue-700 mb-2">${activity.heading}</h3>
                        <p class="text-gray-600 text-sm mb-2">${activity.venue}, ${activity.address} | ${activity.date}</p>
                        <p class="text-gray-700 text-base mb-4 line-clamp-3">${activity.body.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
                        <a href="activity_details.html?id=${activity.id}" class="text-blue-600 hover:underline font-medium inline-flex items-center">
                            Read More <i class="fas fa-arrow-right ml-2 text-sm"></i>
                        </a>
                    </div>
                </div>
            `;
            activitiesContainer.innerHTML += activityCard;
        });
    }

    function setupPagination() {
        paginationContainer.innerHTML = ''; // Clear previous pagination
        const pageCount = Math.ceil(activities.length / itemsPerPage);

        if (pageCount <= 1) return; // No pagination needed for 1 or less pages

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.className = `px-4 py-2 mx-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayActivities(currentPage);
                updatePaginationButtons();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page numbers
        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = `px-4 py-2 mx-1 rounded-md ${i === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayActivities(currentPage);
                updatePaginationButtons();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.className = `px-4 py-2 mx-1 rounded-md ${currentPage === pageCount ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
        nextButton.disabled = currentPage === pageCount;
        nextButton.addEventListener('click', () => {
            if (currentPage < pageCount) {
                currentPage++;
                displayActivities(currentPage);
                updatePaginationButtons();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    function updatePaginationButtons() {
        const buttons = paginationContainer.querySelectorAll('button');
        const pageCount = Math.ceil(activities.length / itemsPerPage);

        buttons.forEach((button, index) => {
            if (button.textContent === 'Previous') {
                button.disabled = currentPage === 1;
                button.className = `px-4 py-2 mx-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
            } else if (button.textContent === 'Next') {
                button.disabled = currentPage === pageCount;
                button.className = `px-4 py-2 mx-1 rounded-md ${currentPage === pageCount ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
            } else {
                const pageNum = parseInt(button.textContent);
                button.className = `px-4 py-2 mx-1 rounded-md ${pageNum === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
            }
        });
    }

    displayActivities(currentPage);
    setupPagination();
}

// --- Logic for activity_details.html (Detail Page) ---
async function renderActivityDetails() {
    const activityDetailsContainer = document.getElementById('activity-details-container');
    if (!activityDetailsContainer) return; // Ensure we are on the activity details page

    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');

    if (!activityId) {
        activityDetailsContainer.innerHTML = '<p class="text-center text-red-500 text-xl py-10">Activity not found. Missing ID.</p>';
        return;
    }

    const activities = await getActivitiesData();
    const activity = activities.find(a => a.id === activityId);

    if (!activity) {
        activityDetailsContainer.innerHTML = '<p class="text-center text-red-500 text-xl py-10">Activity not found.</p>';
        return;
    }

    const detailContent = `
        <div class="bg-gray-50 md:p-8 ">
            <img src="${activity.image}" alt="${activity.heading}" class="w-full h-80 object-cover rounded-md mb-6">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">${activity.heading}</h1>
            <p class="text-gray-600 text-lg mb-4">
                <i class="fas fa-map-marker-alt mr-2"></i> ${activity.venue}, ${activity.address}
            </p>
            <p class="text-gray-600 text-lg mb-6">
                <i class="fas fa-calendar-alt mr-2"></i> ${activity.date} | <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">${activity.type}</span>
            </p>
            <div class="text-gray-700 text-lg leading-relaxed">
                ${activity.body}
            </div>
            <div class="mt-8 text-center">
                <a href="activities.html" class="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
                    <i class="fas fa-arrow-left mr-3"></i> Back to Activities
                </a>
            </div>
        </div>
    `;
    activityDetailsContainer.innerHTML = detailContent;
}

// Determine which function to run based on the current page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('activities-container')) {
        renderActivitiesList();
    } else if (document.getElementById('activity-details-container')) {
        renderActivityDetails();
    }
});