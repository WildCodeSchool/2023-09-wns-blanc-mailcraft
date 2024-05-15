import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const TinyMCE = dynamic(() => import('@/components/TinyMCE/TinyMCE'), { ssr: false });

const RessourcesPage: React.FC = () => {
  const [content, setContent] = useState('<h1>Ressources</h1>');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <TinyMCE content={content} onContentChange={handleContentChange} />
    </>
  );
};

export default RessourcesPage;
