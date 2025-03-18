// Only add enums that are generic.
// Ask yourself, if I create a new unrealted nestjs project will it require the same enums?

export enum OrderBy {
  Ascending = 'ASC',
  Descending = 'DESC',
}
