<?Php 

namespace App\Schedule\Scheduler;

use App\Schedule\Service\Job; 

class JobScheduler implements JobSchedulerInterface
{


    public function __construct(private Job $jobService)
    {
        $this->jobService = $jobService;
    }

    public function schedule(): void
    {
        // Logic to schedule a job using the job service
        $this->jobService->schedule();
    }
}