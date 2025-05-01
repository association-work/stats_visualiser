<?php

namespace App\Scheduler;

// Ensure the Job class exists in the specified namespace
use App\Schedule\JobSchedulerInterface;
use App\Services\Job;

class JobScheduler implements JobSchedulerInterface
{
    public function __construct(private Job $jobService)
    {
        $this->jobService = $jobService;
    }

    public function schedule(): void
    {
        $this->jobService->execute();
    }
}
