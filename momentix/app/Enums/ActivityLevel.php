<?php

namespace App\Enums;

enum ActivityLevel: string
{
    case Info = 'info';
    case Warning = 'warning';
    case Critical = 'critical';
}
