import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiBody, ApiConsumes } from '@nestjs/swagger';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('file')
  export class MulterController {
    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
          if (!allowedTypes.includes(file.mimetype)) {
            return callback(
              new BadRequestException('Not valid file type. Only images are allowed!'),
              false,
            );
          }
          callback(null, true);
        },
      }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('File is required or not valid!');
      }
  
      const baseUrl = 'http://localhost:3000';
      return {
        link: `${baseUrl}/uploads/${file.filename}`,
      };
    }
  }
  