export type DefaultNoteCategoriesNames = string[];
export interface SetupDefaultNoteCategoriesRequest {
  categories: DefaultNoteCategoriesNames;
}
export interface SetupDefaultNoteCategoriesSuccess {
  success: true;
}
export interface SetupDefaultNoteCategoriesError {
  success: false;
}
export type SetupDefaultNoteCategoriesResult =
  | SetupDefaultNoteCategoriesSuccess
  | SetupDefaultNoteCategoriesError;
