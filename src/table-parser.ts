import * as csvParse from 'csv-parse/lib/sync';

/**
 * Derives column types from provided array of rows.
 * TODO: assumes every row has the same number of columns.
 *
 * @param rows -- array of rows.
 * @return array of type columns
 */

type Rows = Array<Array<string>>;
export type ColumnKind = 'number' | 'string';

const numberRe = /^\d+(?:\.\d*)?$|^\.\d+$/;

const guessColumns = (rows: Rows): Array<ColumnKind> => {
  if (rows.length === 0) {
    return [];
  }
  const colCount = rows[0].length;
  let columns: Array<ColumnKind> = [];
  for (let i = 0; i < colCount; i++) {
    if (rows.every((row => !row[i] || numberRe.test(row[i])))) {
      columns.push('number');
    } else {
      columns.push('string');
    }
  }
  return columns;
};

/**
 * Subscribes to paste events, processess them
 * and calls the callback with parsed result.
 *
 * TODO: add unsubscribe
 *
 * @param callback -- this callback will be called with
 * array of derived column types and an array of rows
 * @param options -- unused
 */
type PasteOptions = {};
export const subscribe = (callback: (columns: Array<ColumnKind>, rows: Rows) => void, options?: PasteOptions) => {
  const pasteListener = (event: ClipboardEvent) => {
    // ignore paste events if there is an active input element
    const activeElement = document.activeElement as Element;
    const tag = activeElement && activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') { return; }

    const items = Array.from(event.clipboardData.items);
    items.forEach((item: DataTransferItem) => {
      if (item.kind === 'string' && /^text\/plain/.test(item.type)) {
        item.getAsString(stringCb);
      }
    });
  };

  const stringCb = (str: string) => {
    const rows = csvParse(str, {delimiter: '\t', columns: false, trim: true});
    const cols = guessColumns(rows);
    callback(cols, rows);
  };

  let IEclipboardData = (window as any)['clipboardData'];
  if (IEclipboardData) {
    // TODO: do not paste twice
    window.addEventListener('keypress', (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.keyCode !== 22) { return; }
      let text = IEclipboardData.getData('Text');
      stringCb(text);
    });
  }
  window.addEventListener('paste', pasteListener);
};
