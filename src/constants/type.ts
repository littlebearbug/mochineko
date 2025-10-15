export interface BaseCategory {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
}

export type SubCategory = BaseCategory;

export interface Category extends BaseCategory {
  readonly children: readonly SubCategory[];
}

export interface SubCategoryWithParent extends SubCategory {
  readonly parent: number;
}
