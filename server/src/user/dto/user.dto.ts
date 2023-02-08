export interface UserDto {
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

export enum Status {
    active,
    inactive,
}
export enum Role {
    user = 'user',
    admin = 'admin',
}
