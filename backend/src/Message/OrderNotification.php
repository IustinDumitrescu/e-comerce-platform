<?php

namespace App\Message;

class OrderNotification 
{
    private int $orderId;

    public function setOrderId(int $orderId): static
    {
        $this->orderId = $orderId;

        return $this;
    }

    public function getOrderId(): int
    {
        return $this->orderId;
    }
}