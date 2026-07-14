export interface PaginatedResponse<T> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}
