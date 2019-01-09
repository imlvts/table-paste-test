import './shim';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ExcelPaste from './ExcelPaste';
import pageReady from './page-ready';

pageReady.then(_ => {
  ReactDOM.render(
    <ExcelPaste />,
    document.getElementById('root') as HTMLElement
  );
});
