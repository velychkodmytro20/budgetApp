import { Request } from 'express'
import { UserDto } from '../../user/dto/user.dto'

interface RequestWithUser extends Request {
    user: UserDto
}

export { RequestWithUser }
