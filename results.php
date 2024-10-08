<?php
// results.php

session_start();

function saveQuizResult($topic, $difficulty, $score, $totalQuestions, $timeTaken) {
    // In a real application, you would typically save this to a database
    // For now, we'll just store it in the session as an example
    if (!isset($_SESSION['quiz_results'])) {
        $_SESSION['quiz_results'] = [];
    }
    
    $_SESSION['quiz_results'][] = [
        'topic' => $topic,
        'difficulty' => $difficulty,
        'score' => $score,
        'totalQuestions' => $totalQuestions,
        'timeTaken' => $timeTaken,
        'date' => date('Y-m-d H:i:s')
    ];
}

function getQuizResults() {
    // In a real application, you would typically fetch this from a database
    // For now, we'll just return the session data as an example
    return isset($_SESSION['quiz_results']) ? $_SESSION['quiz_results'] : [];
}

// Handle POST requests to save a new quiz result
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['topic'], $data['difficulty'], $data['score'], $data['totalQuestions'], $data['timeTaken'])) {
        saveQuizResult(
            $data['topic'],
            $data['difficulty'],
            $data['score'],
            $data['totalQuestions'],
            $data['timeTaken']
        );
        echo json_encode(['status' => 'success', 'message' => 'Quiz result saved']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required data']);
    }
}

// Handle GET requests to retrieve quiz results
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $results = getQuizResults();
    echo json_encode($results);
}
?>