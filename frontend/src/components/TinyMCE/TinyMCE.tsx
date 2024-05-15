import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEProps {
  content: string;
  onContentChange: (content: string) => void;
}

const TinyMCE: React.FC<TinyMCEProps> = ({ content, onContentChange }) => {
  const handleEditorChange = (content: string, editor: any) => {
    onContentChange(content);
  };

  return (
    <Editor
      apiKey='dgcriwniq8gnaafcf24ytjx944q7lnb8hiwa03t9l788b4fc'
      initialValue={content}
      init={{
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TinyMCE;