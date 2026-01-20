<?php

namespace App\Enum;

enum NotificationType: string 
{
    case BUYER_NEW_ORDER = 'BUYER_NEW_ORDER';
    case SELLER_NEW_ORDER = 'SELLER_NEW_ORDER';
}