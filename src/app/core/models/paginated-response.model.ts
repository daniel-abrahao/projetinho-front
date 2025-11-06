export interface PaginatedResponse<T> {
  data: T;
  pagination: {
    count: number;
    limit: number;
    page: number;
  };
}
