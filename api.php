<?php
// api.php

require_once 'config.php';

function generateQuizQuestions($topic, $difficulty, $numQuestions = 10) {
    $prompt = "Create a multiple-choice quiz suitable for a government/entrance or competitive exam about '{$topic}' with {$numQuestions} questions at {$difficulty} difficulty. Follow these guidelines:

    1. Questions should be fact-based and objective, focusing on key concepts, theories, data interpretation, and application of knowledge.
    2. For '{$topic}', include a mix of fundamental concepts and more advanced ideas appropriate for the {$difficulty} level.
    3. Questions should test critical thinking, problem-solving, and analytical skills where appropriate.
    4. Include questions that assess the ability to apply theoretical knowledge to practical scenarios or case studies.
    5. Ensure questions are clear, concise, and unambiguous, as typical in standardized tests.
    6. For each question, provide 4 options and indicate the correct answer.
    7. Difficulty levels should be interpreted as follows:
       - Easy: Basic concepts and straightforward applications
       - Medium: More complex concepts and moderate problem-solving
       - Hard: Advanced concepts, intricate problem-solving, and high-level analysis

    Format the response as a JSON array of objects. Each object should have these properties: 'question' (string), 'options' (array of 4 strings), and 'correctAnswer' (integer 0-3 indicating the index of the correct option).";

    $data = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ]
    ];

    $ch = curl_init(GEMINI_API_URL . '?key=' . GEMINI_API_KEY);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return ['error' => 'API request failed: ' . $error];
    }

    $result = json_decode($response, true);

    if (isset($result['error'])) {
        return ['error' => 'API error: ' . $result['error']['message']];
    }

    if (!isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        return ['error' => 'Unexpected API response format'];
    }

    $generatedText = $result['candidates'][0]['content']['parts'][0]['text'];
    
    // Extract JSON from the generated text
    preg_match('/\[[\s\S]*\]/', $generatedText, $matches);
    if (empty($matches)) {
        return ['error' => 'Failed to extract JSON from API response'];
    }
    
    $jsonStr = $matches[0];
    $questions = json_decode($jsonStr, true);

    if (!is_array($questions) || count($questions) == 0) {
        return ['error' => 'Failed to parse generated questions'];
    }

    // Validate and sanitize questions
    $validatedQuestions = [];
    foreach ($questions as $q) {
        if (isset($q['question'], $q['options'], $q['correctAnswer']) &&
            is_array($q['options']) && count($q['options']) == 4 &&
            is_int($q['correctAnswer']) && $q['correctAnswer'] >= 0 && $q['correctAnswer'] <= 3) {
            $validatedQuestions[] = $q;
        }
    }

    if (count($validatedQuestions) == 0) {
        return ['error' => 'No valid questions generated'];
    }

    return $validatedQuestions;
}

function handleAPIRequest() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['topic']) || !isset($data['difficulty'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required parameters']);
            return;
        }

        $topic = $data['topic'];
        $difficulty = $data['difficulty'];
        $numQuestions = isset($data['numQuestions']) ? min(intval($data['numQuestions']), MAX_QUESTIONS) : 10;
        $questions = generateQuizQuestions($topic, $difficulty, $numQuestions);

        header('Content-Type: application/json');
        echo json_encode($questions);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// Only run handleAPIRequest if this file is accessed directly, not when included
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    handleAPIRequest();
}