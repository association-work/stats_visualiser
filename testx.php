<?php 

function getParentExternalId(string $externalId): ?string
    {
        $check_dot = strpos($externalId, '.');
        if (false !== $check_dot) {
            $level_array = explode('.', $externalId);
            array_pop($level_array);
            return implode('.', $level_array);
        } else {
            return null;
        }
    }
print_r(getParentExternalId('V0.2.1.1')) ;
