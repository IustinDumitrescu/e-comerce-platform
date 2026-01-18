<?php

namespace App\Enum;

enum SellerOrderStatus: string
{
    case NEW        = 'new';
    case PROCESSING = 'processing';
    case SHIPPED    = 'shipped';
    case CANCELLED  = 'cancelled';
}
