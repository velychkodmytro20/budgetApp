export interface CreateUserDto {
    id?: string
    firstName: string
    lastName: string
    password: string
    email: string
    phone?: string | null
    status?: Status
    role?: Role
    lastLoginAt?: Date | string | null
    createdAT?: Date | string | null
    updatedAt?: Date | string | null
}

enum Status {
    active,
    inactive,
}
enum Role {
    user,
    admin,
}
