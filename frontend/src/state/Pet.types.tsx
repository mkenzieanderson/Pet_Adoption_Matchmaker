type availability = 'Available' | 'Unavailable';
type gender = 'Male' | 'Female';

export type Pet = {
    name: string;
    breed: string;
    image: string;
    age: number;
    availability: availability;
    gender: gender;
    disposition: string;
    shelter: string;
}