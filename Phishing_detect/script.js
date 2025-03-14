document.getElementById('checkButton').addEventListener('click', function () {
    const url = document.getElementById('urlInput').value.trim();
    if (url) {
        checkPhishing(url);
    } else {
        alert('Please enter a URL');
    }
});

async function checkPhishing(url) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Checking...';

    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
        resultDiv.textContent = '⚠️ Invalid URL format!';
        return;
    }

    // Check if the URL starts with "https://"
    if (!url.startsWith('https://')) {
        resultDiv.textContent = '⚠️ This URL is unsafe (link do not contain HTTPS)!';
        return; // Exit the function early
    }

    // If the URL is HTTPS, proceed with the Safe Browsing API check
    const apiKey = 'AIzaSyDGDtAEwPm6ShqAoGPAmXW2Dhb-qs1oaT4'; // Replace with your API key
    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client: {
                    clientId: 'your-client-id', // Replace with your client ID
                    clientVersion: '1.0',
                },
                threatInfo: {
                    threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
                    platformTypes: ['ANY_PLATFORM'],
                    threatEntryTypes: ['URL'],
                    threatEntries: [{ url }],
                },
            }),
        });

        const data = await response.json();
        if (data.matches && data.matches.length > 0) {
            resultDiv.textContent = '⚠️ This URL is potentially dangerous!';
        } else {
            resultDiv.textContent = '✅ This URL is safe.';
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.textContent = '❌ An error occurred while checking the URL.';
    }
}