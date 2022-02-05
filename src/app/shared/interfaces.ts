export interface User {
  email: string;
  password: string
}

export interface Links {
  url: string;
  name: string
}

export interface Category {
  name?: string;
  imageSrc?: string;
  user?: string;
  _id?: string
}
