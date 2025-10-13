import { CATEGORIES } from '..';

export type Category = typeof CATEGORIES;

export type SubCategory = Category[number]['children'][number];

export type SubCategoryWithParent = SubCategory & {
  parent: number;
};
