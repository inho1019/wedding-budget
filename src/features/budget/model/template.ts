import { makeId } from "./id";
import type { Budget, Item, MajorCategory, SubCategory } from "./types";

// PDF(결혼 예산표 템플릿)에서 추출한 기본 데이터
// - 카테고리 / 구분 / 항목 / 목표액(목표) 기준 구조
// - 비율(split)은 무조건 50:50 고정

export interface TemplateItem {
  name: string;
  goal: number; // 목표액
}

export interface TemplateSubCategory {
  name: string; // 구분(중분류)
  items: TemplateItem[];
}

export interface TemplateMajorCategory {
  name: string; // 카테고리
  goal: number; // 목표액
  subCategories: TemplateSubCategory[];
}

export const weddingTemplate: TemplateMajorCategory[] = [
  {
    name: "준비",
    goal: 0,
    subCategories: [
      {
        name: "첫인사",
        items: [
          { name: "식사", goal: 300_000 },
          { name: "선물", goal: 300_000 },
        ],
      },
      {
        name: "상견례",
        items: [{ name: "식사", goal: 600_000 }],
      },
      {
        name: "청첩장",
        items: [
          { name: "모바일 청첩장", goal: 100_000 },
          { name: "인쇄 청첩장", goal: 200_000 },
          { name: "청첩장 모임", goal: 1_000_000 },
        ],
      },
      {
        name: "예물",
        items: [
          { name: "반지", goal: 1_000_000 },
          { name: "시계", goal: 500_000 },
        ],
      },
      {
        name: "웨딩 촬영",
        items: [
          { name: "스튜디오 촬영", goal: 1_000_000 },
          { name: "야외 촬영", goal: 500_000 },
        ],
      },
    ],
  },
  {
    name: "결혼식",
    goal: 0,
    subCategories: [
      {
        name: "웨딩홀",
        items: [
          { name: "대관료", goal: 3_000_000 },
          { name: "식대", goal: 10_000_000 },
        ],
      },
      {
        name: "스드메",
        items: [
          { name: "스튜디오", goal: 1_000_000 },
          { name: "드레스", goal: 1_500_000 },
          { name: "메이크업", goal: 500_000 },
        ],
      },
      {
        name: "기타",
        items: [{ name: "답례품", goal: 1_000_000 }],
      },
    ],
  },
  {
    name: "신혼여행",
    goal: 0,
    subCategories: [
      {
        name: "항공",
        items: [
          { name: "항공권", goal: 2_000_000 },
          { name: "기내식", goal: 100_000 },
        ],
      },
      {
        name: "숙박",
        items: [{ name: "호텔", goal: 2_000_000 }],
      },
      {
        name: "교통",
        items: [
          { name: "렌터카", goal: 500_000 },
          { name: "대중교통", goal: 100_000 },
        ],
      },
      {
        name: "기타",
        items: [{ name: "사비", goal: 1_000_000 }],
      },
    ],
  },
  {
    name: "집",
    goal: 0,
    subCategories: [
      {
        name: "가전",
        items: [
          { name: "냉장고", goal: 1_000_000 },
          { name: "세탁기", goal: 500_000 },
          { name: "TV", goal: 1_000_000 },
        ],
      },
      {
        name: "침구",
        items: [
          { name: "침대", goal: 500_000 },
          { name: "이불", goal: 300_000 },
          { name: "베개", goal: 100_000 },
        ],
      },
    ],
  },
];

// 템플린 데이터를 store 모델(id 부여)로 변환
export const buildBudgetFromTemplate = (): Budget => ({
  majorCategories: weddingTemplate.map(
    (m): MajorCategory => ({
      id: makeId("m"),
      name: m.name,
      subCategories: m.subCategories.map(
        (s): SubCategory => ({
          id: makeId("s"),
          name: s.name,
          items: s.items.map(
            (i): Item => ({
              id: makeId("i"),
              name: i.name,
              couple: 0,
              split: 50, // 비율 무조건 50:50
              saved: 0,
              goal: i.goal,
            }),
          ),
        }),
      ),
    }),
  ),
});
