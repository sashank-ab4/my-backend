# OurAPP API'S

- POST /signUp
- POST /login
- POST /logout

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:requestId
- POST /request/send/rejected/:requestId

useRouter

- GET /user/connections
- GET /user/reqeusts
- GET /user/feed - feed of the profiles

feed

- /feed?page=1&limit=10 => 1-10 .skip(0) & .limit(10)
- /feed?page=2&limit=10 => 11-20 .skip(10) & .limit(10)
- /feed?page=3&limit=10 => 21-30 .skip(20) & limit(10)
  skip logic:
  skip = (page - 1) \* limit
