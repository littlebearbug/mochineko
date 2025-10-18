import {
  CategoryIcon,
  CodeIcon,
  GamepadIcon,
  HomeIcon,
  MusicIcon,
  PenIcon,
} from './icons';

export const navLinks = [
  {
    label: '首页',
    path: '/',
    icon: HomeIcon,
  },
  {
    label: '分类',
    items: [
      {
        label: '技术世界',
        path: '/category/tech/',
        icon: CodeIcon,
      },
      {
        label: '游戏频道',
        path: '/category/game/',
        icon: GamepadIcon,
      },
      {
        label: '音乐天地',
        path: '/category/music/',
        icon: MusicIcon,
      },
      {
        label: '生活随笔',
        path: '/category/life/',
        icon: PenIcon,
      },
    ],
    icon: CategoryIcon,
  },
];
