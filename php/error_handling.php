<?php
class ProblemDetailsError extends Exception {
    private $status;
    private $title;
    private $type;
    private $detail;

    public function __construct($title, $status = 400, $detail = null, $type = "about:blank") {
        parent::__construct($title);
        $this->status = $status;
        $this->title = $title;
        $this->type = $type;
        $this->detail = $detail;
    }

    public function getStatus() { return $this->status; }
    public function getTitle() { return $this->title; }
    public function getType() { return $this->type; }
    public function getDetail() { return $this->detail; }

    public function sendResponse() {
        http_response_code($this->status);
        header('Content-Type: application/problem+json');
        
        $response = [
            "type" => $this->type,
            "title" => $this->title,
            "status" => $this->status
        ];
        
        if ($this->detail !== null) {
            $response["detail"] = $this->detail;
        }
        
        echo json_encode($response);
        exit();
    }
}

function muestraError(Throwable $e) {
    if ($e instanceof ProblemDetailsError) {
        $e->sendResponse();
    } else {
        http_response_code(500);
        header('Content-Type: application/problem+json');
        echo json_encode([
            "type" => "about:blank",
            "title" => "Error interno del servidor",
            "status" => 500,
            "detail" => $e->getMessage()
        ]);
        exit();
    }
}

set_exception_handler('muestraError');
