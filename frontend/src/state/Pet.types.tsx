type availability = 'available' | 'not available' | 'pending' | 'adopted';
type gender = 'Male' | 'Female';

export type Pet = {
    name: string;
    breed: string;
    image: string;
    age: number;
    availability: availability;
    gender: gender;
    disposition: string[];
    shelter: string;
}