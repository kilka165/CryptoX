<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PurgeUnverifiedUsers extends Command
{
    /**
     * Через сколько часов после регистрации удалять неподтверждённый аккаунт.
     */
    private const STALE_HOURS = 24;

    protected $signature = 'users:purge-unverified';

    protected $description = 'Удаляет неподтверждённые регистрации старше суток (кошелёк удаляется по FK cascade)';

    public function handle(): int
    {
        $cutoff = now()->subHours(self::STALE_HOURS);

        $users = User::whereNull('email_verified_at')
            ->where('created_at', '<', $cutoff)
            ->get();

        $count = 0;
        foreach ($users as $user) {
            // Токенов у неподтверждённых быть не должно, но на всякий случай чистим.
            $user->tokens()->delete();
            $user->delete(); // wallet удалится каскадом (onDelete('cascade'))
            $count++;
        }

        $this->info("Удалено неподтверждённых аккаунтов: {$count}");

        return self::SUCCESS;
    }
}
