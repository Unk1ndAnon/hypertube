<?php

namespace App\Entity;

use Webmozart\Assert\Assert;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *      normalizationContext={
 *          "groups"={"movie_statuses"}
 *      },
 *      denormalizationContext={
 *          "groups"={"movie_statuses"}
 *      },
 *      attributes={"access_control"="is_granted('ROLE_USER')"},
 *      itemOperations={
 *          "get",
 *          "put",
 *          "delete"
 *      }
 * )
 * @ApiFilter(
 *      SearchFilter::class,
 *      properties={
 *          "id": "exact",
 *          "user.id": "exact",
 *          "movie.id": "exact"
 *      }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\MovieStatusRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class MovieStatus
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"movie_statuses"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"movie_statuses"})
     * @Assert\NotNull(message="Time cannot be null")
     * @Assert\NotBlank(message="Time cannot be blank")
     */
    private $time;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="movieStatuses")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"movie_statuses"})
     * @Assert\NotNull(message="User cannot be null")
     * @Assert\NotBlank(message="User cannot be blank")
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Movie", inversedBy="movieStatuses")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"movie_statuses"})
     * @Assert\NotNull(message="Movie cannot be null")
     * @Assert\NotBlank(message="Movie cannot be blank")
     */
    private $movie;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"movie_statuses"})
     */
    private $updatedAt;

    /**
     * @ORM\PrePersist
     */
    public function onCreate() {
        !$this->getUpdatedAt() ? $this->setUpdatedAt(new \DateTime()) : 0;
    }

    /**
     * @ORM\PreUpdate
     */
    public function onUpdate() {
        $this->setUpdatedAt(new \DateTime());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTime(): ?int
    {
        return $this->time;
    }

    public function setTime(int $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getMovie(): ?Movie
    {
        return $this->movie;
    }

    public function setMovie(?Movie $movie): self
    {
        $this->movie = $movie;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
