<?php
namespace App\Imports\Util;

class Logger
{
    private bool $debug;
    private string $logFile;

    public function __construct(bool $debug = true, ?string $logFile = null)
    {
        $this->debug = $debug;
        $this->logFile = $logFile ?: __DIR__ . '/import_debug.log';
    }

    public function log(string $message): void
    {
        if ($this->debug) {
            file_put_contents($this->logFile, date('Y-m-d H:i:s') . ' - ' . $message . PHP_EOL, FILE_APPEND);
        }
    }
}