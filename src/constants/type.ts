/** 基础分类单元，包含通用字段 */
export interface BaseCategory {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
}

/** 子分类 */
export interface SubCategory extends BaseCategory {}

/** 主分类，包含一组子分类 */
export interface Category extends BaseCategory {
  readonly children: readonly SubCategory[];
}

/** 带有父级信息（ID）的子分类 */
export interface SubCategoryWithParent extends SubCategory {
  readonly parent: number;
}
