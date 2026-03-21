<?php

class ProblemDetailsException extends Exception {
    private $content;

    public function __construct(array $content) {
        parent::__construct($content['title'] ?? 'Error');
        $this->content = $content;
    }

    public function sendResponse() {
        $status = $this->content['status'] ?? 400;
        http_response_code($status);
        header("Content-Type: application/problem+json; charset=utf-8");
        echo json_encode($this->content);
        exit();
    }
}
