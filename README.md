
# Bulletin Board

Bulletin Board is a open-source text-only bulletin board that is anonymous and doesn't require registration to use.

## Demo

You can try out Bulletin Board at any of these urls: 

[https://bulletin.nicsena.tk/](https://bulletin.nicsena.tk/)

[https://nicsena-bulletin-board.glitch.me/](https://nicsena-bulletin-board.glitch.me/)

[https://bulletin-board.nicsena.repl.co/](https://bulletin-board.nicsena.repl.co/)

## Demo Notice: 
#### The glitch project and the repl uses the same mongodb server. Persistent Mode is disabled for both, it means the database can be wiped without any warning when one of them starts up. 

#### Persistent Mode can be enabled or disabled on the nicsena.tk instance at anytime without any notice. This instance uses a local-hosted mongodb server. This instance can be down at anytime on any day without any notice.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_SERVER`

`MONGODB_DATABASE`

`MONGODB_USERNAME`

`MONGODB_PASSWORD`

`PERSISTENT`

`APP_TITLE`


## Run Locally

Clone the project

```bash
  git clone https://github.com/nicsena/bulletin-board.git
```

Go to the project directory

```bash
  cd bulletin-board
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## API Endpoints

### GET

#### Get all posts

```http
  GET /api/posts
```


#### Get a post

```http
  GET /api/posts/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of post to fetch|


#### Get all replies for post

```http
  GET /api/replies/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of post to fetch replies of|


### POST

#### Make a new point

```http
  POST /api/create
```

| Body Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | **Required**. Post Name |
| `body`      | `string` | **Required**. Post Body |

#### Make a new reply for a post

```http
  POST /api/create/reply
```

| Body Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `content`      | `string` | **Required**. Post Body |
| `postId`      | `string` | **Required**. Post ID |

