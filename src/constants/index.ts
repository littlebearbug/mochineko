import { Category, SubCategoryWithParent } from './type';

export const CATEGORIES = [
  {
    id: 1,
    name: '技术世界',
    slug: 'tech',
    description: '记录编程学习、前端开发实践与技术思考。',
    children: [
      {
        id: 101,
        name: '前端基础',
        slug: 'frontend-basics',
        description: '深入探讨 HTML, CSS, JavaScript 核心知识。',
      },
      {
        id: 102,
        name: '框架与库',
        slug: 'frameworks-libs',
        description: 'React, Vue 等框架的实践、源码分析与原理探究。',
      },
      {
        id: 103,
        name: '工程化与工具',
        slug: 'engineering-tools',
        description: 'Webpack, Vite, Git, CI/CD 等提高效率的工具和方法。',
      },
      {
        id: 104,
        name: '性能优化',
        slug: 'performance-optimization',
        description: '关于网站加载、渲染性能、用户体验的优化记录。',
      },
      {
        id: 105,
        name: 'UI/UX 与设计',
        slug: 'ui-ux-design',
        description: '关于设计模式、组件库、用户体验的思考。',
      },
      {
        id: 106,
        name: '编程拾遗',
        slug: 'programming-misc',
        description: '一些不属于前端但很有趣的编程知识，比如算法、脚本等。',
      },
    ],
  },
  {
    id: 2,
    name: '游戏频道',
    slug: 'game',
    description: '关于游戏的一切：评测、杂谈、攻略与心得。',
    children: [
      {
        id: 201,
        name: '游戏评测',
        slug: 'game-reviews',
        description: '对新玩或经典游戏的深度评测、优缺点分析。',
      },
      {
        id: 202,
        name: '游戏杂谈',
        slug: 'game-talks',
        description: '讨论游戏设计、行业动态、游戏文化与叙事。',
      },
      {
        id: 203,
        name: '攻略心得',
        slug: 'guides-tips',
        description: '某个游戏的通关技巧、隐藏要素、角色培养心得。',
      },
      {
        id: 204,
        name: '硬件外设',
        slug: 'hardware-peripherals',
        description: '键盘、鼠标、显示器等游戏装备的体验分享。',
      },
    ],
  },
  {
    id: 3,
    name: '音乐随想',
    slug: 'music',
    description: '分享触动我的旋律、专辑乐评与音乐故事。',
    children: [
      {
        id: 301,
        name: '专辑/单曲乐评',
        slug: 'album-reviews',
        description: '对新专辑或触动你的单曲的评价和感受。',
      },
      {
        id: 302,
        name: '歌单分享',
        slug: 'playlist-sharing',
        description: '按主题、心情、场景创建和分享你的私人歌单。',
      },
      {
        id: 303,
        name: '音乐故事',
        slug: 'music-stories',
        description: '介绍某个乐队、歌手或音乐流派背后的故事。',
      },
      {
        id: 304,
        name: '器材与软件',
        slug: 'gear-software',
        description: '耳机、播放器、音乐制作软件等相关内容。',
      },
    ],
  },
  {
    id: 4,
    name: '生活碎笔',
    slug: 'life',
    description: '记录生活、灵感、思考与行走的足迹。',
    children: [
      {
        id: 401,
        name: '日常感悟',
        slug: 'daily-thoughts',
        description: '对生活、工作、学习的思考和反思。',
      },
      {
        id: 402,
        name: '观影读书',
        slug: 'movies-books',
        description: '电影、书籍的观后感、书评。',
      },
      {
        id: 403,
        name: '旅行足迹',
        slug: 'travel-logs',
        description: '记录旅途中的见闻和风景。',
      },
      {
        id: 404,
        name: '灵光一闪',
        slug: 'bright-ideas',
        description: '记录那些突然冒出来的、不成体系的新点子。',
      },
    ],
  },
] as const;

const createSubCategoryMap = (categories: Category) => {
  const map = {} as Record<number, SubCategoryWithParent>;
  categories.forEach((mainCategory) => {
    if (mainCategory.children) {
      mainCategory.children.forEach((subCategory) => {
        map[subCategory.id] = {
          ...subCategory,
          parent: mainCategory.id,
        };
      });
    }
  });
  return map;
};

export const SUB_CATEGORY_MAP = createSubCategoryMap(CATEGORIES);
