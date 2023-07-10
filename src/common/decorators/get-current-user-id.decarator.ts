import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const req = context.switchToHttp().getRequest();
    if (!data) return req.user;
    return req.user['sub'];
  },
);
