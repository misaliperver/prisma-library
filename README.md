# Library-Api

```bash
  docker-compose build
  docker-compose up
```

You will see `Please deploy migrations to database` log on console at first time. Open new terminal and run below code.
Change ./prisma/initialize.sh hostname with localhost and deploy as manual on your commandline.

```bash
  chmod +x ./prisma/initialize.sh && npm run prisma:initialize
```

You will see `Nest application successfully started.` log on console if you run that command.

# Structure

controller -> modules/** -> prisma orm -> database

# Seeding & Migrations

./src/prisma/seed.ts at prisma module init.

# Documentation And Url
Look commandline logs. Default config below;

```yaml
  URL=http://localhost:3000
  DOCUMENT=http://localhost:3000/docs
```