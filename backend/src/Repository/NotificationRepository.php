<?php

namespace App\Repository;

use App\Entity\Notification;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Notification>
 */
class NotificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notification::class);
    }

    public function getEntityManager(): EntityManagerInterface
    {
        return parent::getEntityManager();
    }

    public function save(Notification $notification): void
    {
        $em = $this->getEntityManager();

        $em->persist($notification);

        $em->flush();
    }
}
