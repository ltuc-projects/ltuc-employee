document.addEventListener('DOMContentLoaded', () => {
    const ipDisplay = document.getElementById('ip-display');
    const latDisplay = document.getElementById('lat-display');
    const lngDisplay = document.getElementById('lng-display');
    const detectBtn = document.getElementById('detect-btn');
    const toast = document.getElementById('toast');

    window.showToast = (message, type = 'info') => {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    };

    async function detectIP() {
        try {
            ipDisplay.textContent = 'Fetching...';
            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) throw new Error('IP lookup failed');
            const data = await response.json();
            ipDisplay.textContent = data.ip;
        } catch (error) {
            console.error(error);
            ipDisplay.textContent = 'Error fetching IP';
            showToast('Failed to detect IP address', 'error');
        }
    }

    function detectGPS() {
        if (!navigator.geolocation) {
            showToast('Geolocation is not supported by your browser', 'error');
            return;
        }

        latDisplay.textContent = 'Locating...';
        lngDisplay.textContent = 'Locating...';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                latDisplay.textContent = position.coords.latitude.toFixed(6);
                lngDisplay.textContent = position.coords.longitude.toFixed(6);
                showToast('Location updated successfully', 'success');
            },
            (error) => {
                console.error(error);
                latDisplay.textContent = 'Permission Denied';
                lngDisplay.textContent = 'Permission Denied';
                showToast('Location access denied. Please check permissions.', 'error');
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }

    function runAllDetections() {
        detectIP();
        detectGPS();
    }

    detectBtn.addEventListener('click', runAllDetections);

    // Initial run
    runAllDetections();
});
