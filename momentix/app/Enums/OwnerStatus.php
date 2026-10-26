<?php

namespace App\Enums;

enum OwnerStatus: string
{
    case Active = 'active';
    case Invited = 'invited';
}
