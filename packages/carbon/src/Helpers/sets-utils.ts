export function areSetsEqual<T>(lhs: Set<T>, rhs: Set<T>) {
  return (
    lhs === rhs ||
    (lhs.size === rhs.size && Array.from(lhs).every((x) => rhs.has(x)))
  );
}
