export abstract class BaseModel<T> {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<T>) {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          (this as any)[key] = value;
        }
      });
    }
  }
}
