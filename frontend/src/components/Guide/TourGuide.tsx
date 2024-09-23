import { useState, useEffect } from "react";
import Joyride, { CallBackProps, Step, STATUS, EVENTS } from "react-joyride";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_TOUR } from "@/client/mutations/user/user-mutations";
import Image from "next/image";
import resize from "@/assets/template-page/tour-guide/ResizeMailCraft.png";
import zoneSwap from "@/assets/template-page/tour-guide/zone-swap.png";
import subZoneSwap from "@/assets/template-page/tour-guide/subZones-swap.png";
import { useAuth } from "@/contexts/AuthContext";

interface TourGuideProps {
  start: boolean;
  setStartTour: (value: boolean) => void;
  onTourEnd: () => void;
  userId: number;
}

interface State {
  run: boolean;
  stepIndex: number;
  steps: Step[];
}

const TourGuide = ({
  start,
  setStartTour,
  onTourEnd,
  userId,
}: TourGuideProps) => {
  const totalSteps: number = 5;
  const { setRefreshUser } = useAuth();
  // Fonction pour générer les étapes du tour
  const generateSteps = (val: number): Step[] => [
    {
      content: (
        <section className="flex flex-col">
          <h2>Saisissez une structure et déposez-la sur une zone</h2>
          <div>
            {val} sur {totalSteps}
          </div>
        </section>
      ),
      placement: "left",
      target: "#structure",
    },
    {
      content: (
        <section>
          <h2>Saisissez un module et déposez-le sur une sous-zone</h2>
          <div>
            {val} sur {totalSteps}
          </div>
        </section>
      ),
      placement: "left",
      target: "#modules",
    },
    {
      content: (
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Ajuster la taille de vos sous-zones
          </h2>
          <div className="flex justify-center">
            <Image
              src={resize}
              alt="Ajustement de la taille des sous-zones"
              width={1000}
              height={400}
              objectFit="contain"
              priority
            />
          </div>
          <div className="text-center mt-8 text-lg">
            {val} sur {totalSteps}
          </div>
        </section>
      ),
      placement: "center",
      target: "body",
    },
    {
      content: (
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Interchangez vos zones
          </h2>
          <div className="flex justify-center">
            <Image
              src={zoneSwap}
              alt="zones swap"
              width={1000}
              height={400}
              objectFit="contain"
              priority
            />
          </div>
          <div className="text-center mt-8 text-lg">
            {val} sur {totalSteps}
          </div>
        </section>
      ),
      placement: "center",
      target: "body",
    },
    {
      content: (
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Interchangez vos sous-zones
          </h2>
          <div className="flex justify-center">
            <Image
              src={subZoneSwap}
              alt="sub zones swap"
              width={1000}
              height={400}
              objectFit="contain"
              priority
            />
          </div>
          <div className="text-center mt-8 text-lg">
            {val} sur {totalSteps}
          </div>
        </section>
      ),
      placement: "center",
      target: "body",
    },
  ];

  const [progress, setProgress] = useState<number>(1);

  const [{ run, steps }, setState] = useState<State>({
    run: start,
    stepIndex: 0,
    steps: generateSteps(progress),
  });

  // Mutation pour mettre à jour le tour utilisateur
  const [updateUserTour] = useMutation(UPDATE_USER_TOUR);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      steps: generateSteps(progress),
    }));
  }, [progress]);

  useEffect(() => {
    if (start) {
      setState((prevState) => ({
        ...prevState,
        run: true,
        stepIndex: 0,
      }));
    }
  }, [start]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, type, index } = data;

    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      try {
        // Màj en base de données du boolean pour ne plus load le tuto
        await updateUserTour({ variables: { userId } });
        console.log("Tour updated for user:", userId);
      } catch (error) {
        console.error("Error updating user tour:", error);
      }
      setRefreshUser(true);
      setState({ steps, run: false, stepIndex: 0 });
      setStartTour(false); // Arrêter le tour et réinitialiser
      onTourEnd(); // Callback pour notifier la fin du tour
    } else if (([EVENTS.STEP_BEFORE] as string[]).includes(type)) {
      setProgress(index + 1); // Mettre à jour la progression
    }
  };

  return (
    <Joyride
      continuous
      callback={handleJoyrideCallback}
      run={run}
      steps={steps}
      scrollToFirstStep
      showSkipButton
      disableCloseOnEsc
      disableOverlayClose
      spotlightPadding={10}
      locale={{
        next: "Suivant",
        skip: "Passer",
        back: "Retour",
        last: "J'ai compris",
      }}
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
};

export default TourGuide;
