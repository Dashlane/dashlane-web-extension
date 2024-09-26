export interface Page<D> {
  batch: D[];
  nextToken?: string;
  prevToken?: string;
}
