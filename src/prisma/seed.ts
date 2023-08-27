import { PrismaClient } from '@prisma/client';
import { exec } from "child_process";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function migrationDeploy() {
    return new Promise((resolve, reject) => {
        console.log('Deploying migrations...');
        exec("npm run prisma:initialize", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                process.exit(1);
                return;
            }

            if (stderr) {
                console.log(`stderr: ${stderr}`);
                process.exit(1);
                return;
            }

            resolve(true);
        });
    });
}

export async function seeding(prisma: PrismaClient) {
    try {
        for (let book of BooksMock) {
            await prisma.book.upsert({
                where: { id: book.id },
                update: {},
                create: {
                    name: book.name,
                },
            });
        }

        for (let user of UserMocks) {
            await prisma.user.upsert({
                where: { id: user.id },
                update: {},
                create: {
                    name: user.name,
                },
            });

            const loanExists = await prisma.loan.findFirst({ where: {}});

            if (!loanExists && user.books?.past?.length > 0) {
                for (let book of user.books.past) {
                    
                    await prisma.book.update({
                        where: { id: book.id },
                        data: {
                            onloan: false,
                            loan: {
                                create: {
                                    userId: user.id,
                                    returned_at: new Date(),
                                    score: book.userScore,
                                }
                            }
                        }
                    });
                }
            }

            if (!loanExists && user.books?.present?.length > 0) {
                for (let book of user.books.present) {
                    await prisma.book.update({
                        where: { id: book.id },
                        data: {
                            onloan: true,
                            loan: {
                                create: {
                                    userId: user.id,
                                }
                            }
                        }
                    });
                }
            }
        }
        
    } catch(err) {
        if (err.message.indexOf('does not exist in the current database') > -1) {
            console.log('Please deploy migrations to database!');
            await migrationDeploy();
            await seeding(prisma);
        } else {
            console.log(err.message);
        }
    }
    
}

const UserMocks = [
    {
        "id": 1,
        "name": "Eray Aslan"
    },
    {
        "id": 2,
        "name": "Enes Faruk Meniz",
        "books": {
            "past": [
                {
                    "id": 2,
                    "userScore": 5
                },
                {
                    "id": 1,
                    "userScore": 10
                }
            ],
            "present": [
                {
                    "id": 5,
                    "name": "Brave New World"
                }
            ]
        }
    },
    {
        "id": 3,
        "name": "Sefa Eren Şahin"
    },
    {
        "id": 4,
        "name": "Kadir Mutlu"
    },
];

const BooksMock = [
    {
        "id": 1,
        "name": "The Hitchhiker's Guide to the Galaxy"
    },
    {
        "id": 2,
        "name": "I, Robot"
    },
    {
        "id": 3,
        "name": "Dune"
    },
    {
        "id": 4,
        "name": "1984"
    },
    {
        "id": 5,
        "name": "Brave New World"
    },
];