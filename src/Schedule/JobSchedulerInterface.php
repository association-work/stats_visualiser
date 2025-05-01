<?php

namespace App\Schedule;

interface JobSchedulerInterface
{
    public function schedule(): void;
}
