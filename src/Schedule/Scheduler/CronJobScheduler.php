<?php

namespace App\Schedule\Scheduler;

class CronJobScheduler implements JobSchedulerInterface
{
    public function __construct(private JobSchedulerInterface $jobScheduler)
    {
        $this->jobScheduler = $jobScheduler;
    }

    public function schedule(): void
    {
        // Logic to schedule a cron job using the job scheduler
        $this->jobScheduler->schedule();
    }
}
