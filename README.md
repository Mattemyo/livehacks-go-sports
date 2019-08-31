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
  type: 'start' | 'finish'
  <!-- todo: data -->
}
```

From User to Server:

```
{
  userId: String,
  teamId: 'liverpool' | 'manchesteru',
  type: 'team_select' | 'scream'
}
```

From Server to Admin:

```
{
  liverpool: {
    score: Number,  # 0 - 100
    intensity: Number, # 0 - 100
  },
  manchesteru: {
    score: Number,  # 0 - 100
    intensity: Number, # 0 - 100
  },
  type: 'live_score'
}
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
