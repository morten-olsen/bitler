import { Editor as MonacoEditor } from '@monaco-editor/react';
import clsx from 'clsx';
import React, { ComponentProps, useRef } from 'react';

type Props = ComponentProps<typeof MonacoEditor>;

const Editor = ({ className, ...props }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={divRef}
      className={clsx(className, 'relative h-full')}
    >
      <div className="absolute inset-0">
        <MonacoEditor
          theme="vs-dark"
          defaultLanguage="yaml"
          {...props}
        />
      </div>
    </div >
  );
}

export { Editor };
