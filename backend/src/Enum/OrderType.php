<?php

namespace App\Enum;

enum OrderType: string
{
    case BOUGHT = 'bought';
    case SOLD = 'sold';
}