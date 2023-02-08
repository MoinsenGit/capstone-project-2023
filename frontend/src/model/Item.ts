export type Image = {
    name:string;
}

export type Item = {
    id?:string;
    name:string;
    price:number;
    description:string;
    image:Image;
    category:string;

    status: string;
}