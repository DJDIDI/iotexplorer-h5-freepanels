import React from 'react';
import { entryWrap } from '@src/entryWrap';
import { useDocumentTitle } from '@src/panels/KugouMusic/panel-default/hooks/useDocumentTitle';


function App() {
  useDocumentTitle('dj test panel');

  return (
    <div>hello world</div>
  );
}

entryWrap(App);
