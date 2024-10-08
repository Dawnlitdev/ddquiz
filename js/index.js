document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const errorMessage = document.getElementById('errorMessage');

    if (quizForm) {
        quizForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(quizForm);
            const topic = formData.get('topic') || formData.get('predefinedTopic');
            const difficulty = formData.get('difficulty');
            const numQuestions = formData.get('numQuestions');

            if (!topic || !difficulty || !numQuestions) {
                showError('Please fill in all required fields.');
                return;
            }

            // Redirect to quiz.php with query parameters
            window.location.href = `quiz.php?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&numQuestions=${encodeURIComponent(numQuestions)}`;
        });
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }
});