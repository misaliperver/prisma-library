# Library-Api

```bash
  docker-compose build
  docker-compose up
```

You will see `Please deploy migrations to database` log on console at first time. Open new terminal and run below code.

```bash
  chmod +x ./prisma/initialize.sh && npm run prisma:initialize
```

You will see `Nest application successfully started.` log on console if you run that command.