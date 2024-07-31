enum ElemType {
  Paragraph = 0,
  Sheet,
  List,
  Table,
  Note,
}

type Elem = {
  elementId: number;
  type: ElemType,
  content: string;
  metadata: string[];
}

type Page = {
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

export { type Lesson, type Elem, ElemType }
