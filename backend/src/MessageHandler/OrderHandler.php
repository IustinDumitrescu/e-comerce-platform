<?php

namespace App\MessageHandler;

use App\Entity\Notification;
use App\Enum\NotificationType;
use App\Message\OrderNotification;
use App\Repository\NotificationRepository;
use App\Repository\OrderRepository;
use App\Repository\SellerOrderRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class OrderHandler 
{
    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly NotificationRepository $notificationRepository,
        private readonly SellerOrderRepository $sellerOrderRepository,
        private readonly HubInterface $hub,
        private readonly LoggerInterface $logger
    ) {}

    public function __invoke(OrderNotification $orderNotification): void
    {
        $em = $this->notificationRepository->getEntityManager();

        $em->beginTransaction();

        try {
            $order = $this->orderRepository->find($orderNotification->getOrderId());

            if (is_null($order)) {
                throw new \RuntimeException("I dindn't find order " . $orderNotification->getOrderId());
            }

            $sellerOrders = $this->sellerOrderRepository->findBy(["order" => $order]);

            $em->persist(
                $orderNot = (new Notification())
                    ->setUser($order->getBuyer())
                    ->setMessage("You ordered a new item !")
                    ->setType(NotificationType::BUYER_NEW_ORDER)
                    ->setCreatedAt((new \DateTime()))
                    ->setUpdatedAt(null)
                    ->setRead(false)
                    ->setData(["orderId" => $order->getId()])
            );            

            if (empty($sellerOrders)) {
                throw new \RuntimeException("I dindn't find seller orders of " . $orderNotification->getOrderId());
            }

            $notifications = [$orderNot];

            foreach ($sellerOrders as $sellerOrder) {
                $em->persist(
                    $sellerNot = (new Notification())
                     ->setUser($sellerOrder->getSeller())
                     ->setMessage("A new item has been ordered!")
                     ->setType(NotificationType::SELLER_NEW_ORDER)
                     ->setCreatedAt((new \DateTime()))
                     ->setUpdatedAt(null)
                     ->setRead(false)
                     ->setData(["orderId" => $sellerOrder->getId()])
                );

                $notifications[] = $sellerNot;
            }

            $em->flush();
        
            $em->commit();

            foreach ($notifications as $not) {
                $update =  new Update(
                    topics: "/user/{$not->getUser()->getId()}/notifications",
                    data: json_encode([
                        "id" => $not->getId(),
                        "message" => $not->getMessage(),
                        "createdAt" => $not->getCreatedAt()->format('Y-m-d'),
                        "type" => $not->getType()->value
                    ])
                );

                $this->hub->publish($update);
            }

            $this->logger->critical("I sent " . count($notifications) . ' notifications !');

        } catch (\Throwable $e) {
            if ($em->getConnection()->isTransactionActive()) {
                $em->rollback();
            }

            $this->logger->critical('Message consume resulted in error: ' . $e->getMessage());
        }
    }   
}