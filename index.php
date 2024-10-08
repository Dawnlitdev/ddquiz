<?php require_once 'config.php'; require_once 'api.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dawnlit Dev Quiz</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-light">
    <?php include 'includes/header.php'; ?>

    <main class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-lg border-0 rounded-lg">
                    <div class="card-header bg-primary text-white text-center py-4">
                        <h2 class="mb-0"><i class="fas fa-brain me-2"></i>Start Your Quiz Adventure</h2>
                    </div>
                    <div class="card-body p-5">
                        <form id="quizForm">
                            <div class="mb-4">
                                <label for="topic" class="form-label">
                                    <i class="fas fa-lightbulb me-2"></i>Enter a topic or choose from the list:
                                </label>
                                <input type="text" class="form-control form-control-lg" id="topic" name="topic" placeholder="Eg. Ncert Newton's laws of motion">
                            </div>

                            <div class="mb-4">
                                <label for="predefinedTopic" class="form-label">
                                    <i class="fas fa-list-ul me-2"></i>Or select a predefined topic:
                                </label>
                                <select class="form-select form-select-lg" id="predefinedTopic" name="predefinedTopic">
                                    <option value="">-- Select a topic --</option>
                                    <option value="history">History</option>
                                    <option value="science">Science</option>
                                    <option value="literature">Literature</option>
                                    <option value="geography">Geography</option>
                                    <option value="mathematics">Mathematics</option>
                                    <option value="politics">Politics</option>
                                    <option value="information-technology">Information Technology</option>
                                    <option value="2024-current-affairs">Current Affairs</option>
                                </select>
                            </div>

                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <label for="difficulty" class="form-label">
                                        <i class="fas fa-chart-line me-2"></i>Select difficulty:
                                    </label>
                                    <select class="form-select form-select-lg" id="difficulty" name="difficulty" required>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="numQuestions" class="form-label">
                                        <i class="fas fa-question-circle me-2"></i>Number of questions:
                                    </label>
                                    <select class="form-select form-select-lg" id="numQuestions" name="numQuestions" required>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="30">25</option>
                                    </select>
                                </div>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-lg">
                                    <i class="fas fa-play me-2"></i>Start Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div id="errorMessage" class="alert alert-danger mt-4" style="display: none;"></div>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/index.js"></script>
</body>
</html>