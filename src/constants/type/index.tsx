import { CATEGORIES } from '..';

export type CategoryType =
  (typeof CATEGORIES)[keyof typeof CATEGORIES]['label'];
