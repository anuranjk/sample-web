document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    const quoteText = document.getElementById('quote-text');
    const randomQuoteBtn = document.getElementById('random-quote-btn');
    const randomQuoteDisplay = document.getElementById('random-quote-display');

    const apiUrl = 'http://localhost:3000'; // Adjust if your backend is elsewhere

    // --- Event Listener for Submitting a New Quote ---
    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = quoteText.value;

        try {
            const response = await fetch(`${apiUrl}/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                alert('Quote submitted successfully!');
                quoteText.value = '';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error submitting quote:', error);
            alert('An error occurred. Please check the console.');
        }
    });

    // --- Event Listener for Fetching a Random Quote ---
    randomQuoteBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${apiUrl}/quotes/random`);

            if (response.ok) {
                const quote = await response.json();
                randomQuoteDisplay.textContent = `"${quote.text}"`;
            } else {
                const errorData = await response.json();
                randomQuoteDisplay.textContent = `Error: ${errorData.error}`;
            }
        } catch (error) {
            console.error('Error fetching random quote:', error);
            randomQuoteDisplay.textContent = 'An error occurred. Please check the console.';
        }
    });
});
