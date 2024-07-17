import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { PageDto } from '@core/pagination/dto/page-dto';
import { ResponseDto } from '@core/query/dto/response-dto';
import { isString } from 'lodash';

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(PageDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            type: 'object',
            properties: {
              statusCode: {
                type: 'number',
                example: 200,
              },
              data: {
                allOf: [
                  { $ref: getSchemaPath(PageDto) },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: getSchemaPath(dataDto) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      status: HttpStatus.OK,
      description: 'Successful',
    }),
  );
export const ApiOkResponseDefault = <DataDto extends Type<unknown>>(dataDto: DataDto) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            type: 'object',
            properties: {
              statusCode: {
                type: 'number',
                example: 200,
              },
              data:
                dataDto.name === 'String'
                  ? {
                      type: 'string',
                      example: 'Example',
                    }
                  : {
                      $ref: getSchemaPath(dataDto),
                    },
            },
          },
        ],
      },
      status: HttpStatus.OK,
      description: 'Successful',
    }),
  );
};
