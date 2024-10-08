<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dawnlit Dev Quiz</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <link rel="stylesheet" href="css/quiz.css">
</head>
<body class="bg-light">
    <?php include 'includes/header.php'; ?>

    <main class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div id="quizContainer" class="card shadow-lg border-0 rounded-lg position-relative">
                    <div class="card-header bg-primary text-white text-center py-4">
                        <h2 id="quizTopic" class="mb-0"><i class="fas fa-question-circle me-2"></i>Quiz Topic</h2>
                    </div>
                    <div class="card-body p-5">
                        <div id="questionContainer"></div>
                        <button id="submitQuiz" class="btn btn-success btn-lg mt-4 w-100">
                            <i class="fas fa-check-circle me-2"></i>Submit Quiz
                        </button>

                        <div id="loadingIndicator" class="text-center position-absolute top-50 start-50 translate-middle" style="display: none;">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Loading quiz...</p>
                        </div>
                    </div>
                </div>

                <div id="resultsContainer" class="card shadow-lg border-0 rounded-lg mt-4" style="display: none;">
                    <div class="card-header bg-success text-white text-center py-4">
                        <h2 class="mb-0"><i class="fas fa-trophy me-2"></i>Quiz Results</h2>
                    </div>
                    <div class="card-body p-5">
                        <div id="timerDisplay" class="alert alert-info mb-4">
                            <i class="fas fa-clock me-2"></i>Time: <span id="timeSpent">00:00</span>
                        </div>
                        <h3 class="text-center mb-4">Your Score: <span id="score" class="fw-bold text-primary"></span></h3>
                        <div id="questionReview" class="mb-4"></div>
                        <button id="newQuiz" class="btn btn-primary btn-lg w-100">
                            <i class="fas fa-redo-alt me-2"></i>Start New Quiz
                        </button>
                    </div>
                </div>

                <div id="errorMessage" class="alert alert-danger mt-4" style="display: none;"></div>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/quiz.js"></script>
</body>
</html>