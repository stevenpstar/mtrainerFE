enum ElemType {
  Paragraph = 0,
  Sheet,
  List,
  Table,
  Note,
  TextQuestionChoice,
  SheetQuestionChoice,
  SheetQuestionNotate,
  SheetQuestionInteract,
  SheetQuestionWritten,
}

enum PageType {
  Teaching,
  Test,
}

type Metadata = {
  tag: string;
  content: string;
}

type Elem = {
  elementId: number;
  type: ElemType,
  content: string;
  metadata: Metadata[];
}

type Page = {
  type: PageType,
  num: number;
  title: string;
  elements: Elem[];
}
type Lesson = {
  title: string;
  subtitle: string;
  tags: string[];
  pages: Page[];
}

export { type Lesson, type Elem, ElemType, PageType, type Metadata, type Page }
