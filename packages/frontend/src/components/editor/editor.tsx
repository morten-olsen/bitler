import { Editor as MonacoEditor } from '@monaco-editor/react';
import clsx from 'clsx';
import React, { ComponentProps, useRef } from 'react';

type Props = ComponentProps<typeof MonacoEditor>;

const Editor = ({ className, ...props }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={divRef} className={clsx(className, 'relative h-full')}>
      <div className="absolute inset-0">
        <MonacoEditor
          theme="vs-light"
          defaultLanguage="yaml"
          {...props}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'off',
            ...(props.options || {}),
          }}
        />
      </div>
    </div>
  );
};

export { Editor };
