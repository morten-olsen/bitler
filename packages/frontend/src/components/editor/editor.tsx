import { Editor as MonacoEditor } from '@monaco-editor/react';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import clsx from 'clsx';
import React, { ComponentProps, useRef } from 'react';

type Props = ComponentProps<typeof MonacoEditor> & {
  footer?: React.ReactNode;
};

const Editor = ({ className, ...props }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={divRef} className={clsx(className, 'relative h-full')}>
      <Card radius="sm" shadow="sm" isBlurred isFooterBlurred className="absolute inset-0">
        <CardBody className="rounded overflow-hidden">
          <MonacoEditor
            theme="vs-dark"
            className="rounded overflow-hidde"
            defaultLanguage="yaml"
            {...props}
            options={{
              minimap: { enabled: false },
              lineNumbers: 'relative',
              ...(props.options || {}),
            }}
          />
        </CardBody>
        {props.footer && <CardFooter>{props.footer}</CardFooter>}
      </Card>
    </div>
  );
};

export { Editor };
