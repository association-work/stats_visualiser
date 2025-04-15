<?php

namespace App\Schedule\Scheduler;

interface JobSchedulerInterface
{
    public function schedule(): void;
}
