type pText = {
  text: string;
  highlighted: boolean;
  highlight: highlight | null;
}

type highlight = {
  page: number;
  paragraphId: number;
  indexStart: number;
  indexEnd: number;
  note: string;
  colour: string;
}

function HighlightParagraph(paragraph: string, highlights: highlight[]): pText[] {
  const elements: pText[] = [];
  let startIndex = 0;
  if (highlights.length === 0) {
    elements.push({
      text: paragraph,
      highlighted: false,
      highlight: null,
    });
    return elements;
  }

  //sort highlights by index
  highlights.sort((a: highlight, b: highlight) => {
      return a.indexStart - b.indexStart;
  });

  highlights.forEach(h => {
    // create non-highlighted text (if exists)
    if (startIndex + h.indexStart > 0) {
      elements.push({
        text: paragraph.substring(startIndex, h.indexStart),
        highlighted: false,
        highlight: null,
      })
    }
    elements.push({
      text: paragraph.substring(h.indexStart, h.indexEnd),
      highlighted: true,
      highlight: h,
    });
    startIndex = h.indexEnd;
  });

  // catch any left over non-highlighted text

  if (startIndex < paragraph.length) {
    elements.push({
      text: paragraph.substring(startIndex, paragraph.length),
      highlighted: false,
      highlight: null,
    });
  }

  return elements;
}

const AddHighlight = (page: number,
                      highlights: highlight[],
                      setHighlights: (hl: highlight[]) => void) => {
// element id is being manually set to 0 we are just testing with
// the initial paragraph element of the page for now.
  const s = window.getSelection();
  const defaultColour = 'rgba(202, 255, 191, 0.5)';
  if (s) {
    const ancOffset = s.anchorOffset;
    const focOffset = s.focusOffset;
    if (ancOffset === undefined || focOffset === undefined) {
      console.log("ancOffset or focOffset undefined");
      return;
    }
    const paraElement = s.anchorNode?.parentElement?.parentElement;
    if (!paraElement) {
      console.error("Paragraph element not found for selection");
      return;
    }
    const eId = parseInt(paraElement.id.split('-')[1]);
    const initElement = s.anchorNode?.parentElement;
    if (s.focusNode?.parentElement !== s.anchorNode?.parentElement) {
      return;
    }
    // this is the span element that the highlighted text will have originally belonged to
    // We need this to prevent highlighting of duplicate words/phrases etc.
    if (!initElement) {
      console.error("Initial span element not found for selection");
      return;
    }
    const newHighlight: highlight = {
      page: page,
      paragraphId: eId,
      indexStart: 0,
      indexEnd: 0,
      note: "",
      colour: defaultColour,
    };
    // This looks confusing but works as follows
    // ancOffset (anchorOffset) is where you started the text selection
    // focOffset (focusOffset) is where you ended it
    // Depending on the direction of your selection (left to right, right to left)
    // One will be larger than the other, we need to figure out which
    // is less/more to determine our starting and ending selection index
    const startOffset = ancOffset > focOffset ? focOffset : ancOffset;
    const endOffset = ancOffset > focOffset ? ancOffset : focOffset;
    let runningIndex = 0;
    for (const child of paraElement.children) {
      if (child === initElement) {
        newHighlight.indexStart = runningIndex + startOffset;
        newHighlight.indexEnd = runningIndex + endOffset;
      } else {
        if (child.textContent) {
          runningIndex += child.textContent?.length;
        }
      }
    }
    const oldHl: highlight[] = [...highlights];
    oldHl.push(newHighlight);
    setHighlights(oldHl);
  }
}

function UpdateHighlight(highlight: highlight,
                         highlights: highlight[],
                         setHighlights: (h: highlight[]) => void,
                         colour: string,
                         note: string): void {
  const oldHl = [...highlights];
  const toUpdate = oldHl.find(h => h === highlight);
  if (toUpdate === undefined) { return; }
  toUpdate.colour = colour;
  toUpdate.note = note;
  setHighlights(oldHl);
 }


export { 
    HighlightParagraph,
    AddHighlight,
    UpdateHighlight,
    type highlight,
    type pText
}
