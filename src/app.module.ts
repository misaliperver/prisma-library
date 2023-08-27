import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@prismamodule/prisma.module';
import { UserModule } from '@modules/user/user.module';
import { BookModule } from '@modules/book/book.module';
import { UserController } from '@controllers/user.controller';
import { BookController } from '@controllers/book.controller';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@common/pipes/validator.pipe';
import { HttpLoggingInterceptor } from '@common/interceptors/http.interceptor';
import { HttpExceptionFilter } from '@common/filters/exception.filter';


const providers: Provider[] = [
  {
    provide : APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
  {
    provide : APP_INTERCEPTOR,
    useClass: HttpLoggingInterceptor,
  }
];

@Module({
  imports: [
    PrismaModule,
    UserModule,
    BookModule,
  ],
  providers: providers,
  controllers: [
    UserController,
    BookController,
  ],
})
export class AppModule {}
