import dynamic from "next/dynamic";

// Page de test pour le front

const ResizePanel = dynamic(() => import("react-resize-panel"), { ssr: false });

const TestPage = () => {
  return (
    <section>
      <h1 className="text-center text-3xl mb-4">Page de test</h1>
      <div>
        <ResizePanel direction="e" className="w-1/4">
          <div className="max-w-xl">
            {" "}
            {/* Largeur maximale définie à 28rem */}
            <ResizePanel direction="s">
              <div className="flex-1 p-4 border-solid border-4 border-red-500 max-h-48">
                {" "}
                {/* Hauteur maximale définie à 16rem */}
                Main content area inside resize panel
              </div>
            </ResizePanel>
          </div>
        </ResizePanel>
      </div>
    </section>
  );
};

export default TestPage;
