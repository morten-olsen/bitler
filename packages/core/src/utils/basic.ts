const excludeUndefined = <T>(items: T[]): NonNullable<T>[] => items.filter(Boolean) as NonNullable<T>[];

export { excludeUndefined };
