# nuxt-app

> My fantabulous Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Messages

From Admin to Server to User:

```
{
  type: 'countdown' | 'start' | 'finish'
  countdown: Number # 1 - 10
  stage: 'ready' | 'ongoing'
}
```

From User to Server:

```
{
  userId: String,
  teamId: 'liverpool' | 'manchesteru',
  volume: Number, # 1 - 100
  type: 'team_select' | 'scream'
}
```

From Server to Admin:

```
{
  teams: {
    liverpool: {
      score: Number,  # 0 - 100
      intensity: Number, # 0 - 100
    },
    manchesteru: {
      score: Number,  # 0 - 100
      intensity: Number, # 0 - 100
    },
  },
  userId: String,
  teamId: String,
  type: 'live_score' | 'team_select'
}
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
