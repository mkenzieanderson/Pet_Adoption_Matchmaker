type UserType = 'admin' | 'user';

export type User = {
    id: number;
    name: string;
    email: string;
    type: UserType;
}

export const dummyUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'myemail@gmail.com',
    type: 'user'
}