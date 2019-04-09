<?php

namespace App\Services;

use App\Entity\User;
use App\Services\Curl;
use App\Services\ApiCore;
use Doctrine\Common\Persistence\ObjectManager;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;

class ApiGoogle extends ApiCore
{
    /**
     * @param Curl $curl
     * @param UserManagerInterface $userManager
     * @param ObjectManager $objectManager
     */
    public function __construct(Curl $curl, UserManagerInterface $userManager, ObjectManager $objectManager)
    {
        parent::__construct($curl, $userManager, $objectManager);
        $this->setUrl("https://www.googleapis.com/oauth2/v4/token");
        $this->setUser_url("https://www.googleapis.com/oauth2/v1/userinfo?alt=json");
        $this->setClient_id("39760124824-ehshl281mip2ejm0f9l5vkgdb672j16g.apps.googleusercontent.com");
        $this->setClient_secret("MfrqQ_-ZgG7kZWHQnAn9cz1b");
        $this->setRedirect_uri("https://hypertube.barthonet.ovh/oauth/gmail");
    }

    /**
     * Make a 42 API request to get a token
     *
     * @param string $code
     * @param JWTManager $jwtManager
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function getToken(string $code, $jwtManager)
    {
        $this->jwtManager = $jwtManager;
        $data = [
            "grant_type" => "authorization_code",
            "client_id" => $this->getClient_Id(),
            "client_secret" => $this->getClient_secret(),
            "redirect_uri" => $this->getRedirect_uri(),
            "code" => $code
        ];
        $resp = $this->curl->postJson($this->getUrl(), json_encode($data));
        
        if ($resp["code"] === 200) {
            $resp = json_decode($resp["resp"]);
            if (isset($resp->error)) {
                return $this->displayError(401, $resp->error_description, $resp->error);
            }
            return $this->getUserData($resp->access_token);
        }
        return $this->displayError($resp["code"], $resp["resp"]);
    }

    /**
     * Search the user in database then return a token if exists or JsonResponse
     *
     * @param string $token
     * @return JsonResponse|JWTAuthenticationSuccessResponse
     */
    public function getUserData(string $token)
    {
        $userData = $this->curl->getData($this->getUser_url(), $token);

        if ($userData["code"] === 200) {
            $userData = json_decode($userData["resp"]);
            $userData = [
                "plainpassword" => $userData->id . $userData->family_name . "gmailhypertube",
                "username" => $userData->id . "-" . $userData->name,
                "email" => $userData->id . "-" . $userData->family_name . "-gmail@hypertube.com",
                "firstname" => $userData->given_name,
                "lastname" => $userData->family_name,
                "avatarUrl" => $userData->picture,
                "lang" => $userData->locale
            ];
            return $this->findUser($userData);
        }
        return $this->displayError($userData["code"], $userData["resp"]);
    }
}