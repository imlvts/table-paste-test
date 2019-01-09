import * as React from 'react';
import './ExcelPaste.css';
import * as excelPaste from './table-parser';
import InputNumber from './rc-input-number';
import { ColumnKind } from './table-parser';

type ExcelPasteProps = {};

type ExcelPasteState = {
    columns: Array<ColumnKind>,
    rows: Array<Array<any>>,
};

type InputEvent = React.FormEvent<HTMLInputElement>;

type RowProps = {
  columns: Array<ColumnKind>,
  data: Array<any>,
  index: number,
  onChange?: (event: InputEvent) => void,
  onChangeNumber: (col: number, row: number, value: number) => void,
};

const RenderRow = (props: RowProps) => {
  const { columns, data, index, onChange, onChangeNumber } = props;
  return (
    <div key={index} className="table-row">
      {data.map((datum, i) =>
        columns[i] === 'string'
          ? <input
                key={i} data-row={index} data-col={i} type="text"
                value={datum} onChange={onChange} />
          : <InputNumber
                key={i} value={datum}
                onChange={(value: number) => onChangeNumber(index, i, value)} />
      )}
    </div>
  )
};

const numberRe = /^\d+(?:\.\d*)?$|^\.\d+$/;
export class ExcelPaste extends React.Component<ExcelPasteProps, ExcelPasteState> {
  constructor(props: ExcelPasteProps) {
    super(props);
    this.state = {
      columns: [],
      rows: [],
    };
  }

  changeValue = (row: number, col: number, value: any) => {
    let { rows } = this.state;
    rows = rows.slice();
    rows[row] = rows[row].slice();
    rows[row][col] = value;
    this.setState({rows});
  };

  onChange = (event: InputEvent, test?: any) => {
    let target = event.target as HTMLInputElement;
    let value = target.value;
    let row = Number(target.dataset.row);
    let col = Number(target.dataset.col);
    this.changeValue(row, col, value);
  };

  acceptData = (columns: Array<ColumnKind>, rows: Array<Array<string>>) => {
    // newlines to spaces
    rows = rows.map((row) => row.map((val) => val.replace(/\n/g, ' ')));

    this.setState({columns, rows});
  };

  componentDidMount() {
    excelPaste.subscribe(this.acceptData, {});
  }

  render() {
    const { columns, rows } = this.state;
    if (columns.length === 0 || rows.length === 0) {
      return (
        <div className="empty-table-text">
          Copy-Paste Excel table to this window to check the component
        </div>
      );
    } else {
      return (
        <div className="excel-table-rows">
          {rows.map((data, index) =>
            RenderRow({
              columns, data, index,
              onChange: this.onChange,
              onChangeNumber: this.changeValue
            }))}
        </div>
      );
    }
  }
}

export default ExcelPaste;
