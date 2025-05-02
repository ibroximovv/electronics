import { SetMetadata } from "@nestjs/common"
import { UserRole } from "@prisma/client"

export const ROLES_KEY = 'roles'
export const RolesDecorator = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)