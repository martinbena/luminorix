import { PropsWithChildren, ReactNode } from "react";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <section>
      <StepsContainer>
        <Step step={1} currentStep={currentStep}>
          <StepNumber>1</StepNumber>
          Cart
        </Step>

        <Step step={2} currentStep={currentStep}>
          <StepNumber>2</StepNumber> Payment Method
        </Step>
        <Step step={3} currentStep={currentStep}>
          <StepNumber>3</StepNumber> Contact Details
        </Step>
      </StepsContainer>
    </section>
  );
}

function StepsContainer({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-3 justify-items-center font-sans font-medium text-lg mob-lg:text-base">
      {children}
    </div>
  );
}

interface StepProps {
  children: ReactNode;
  step: number;
  currentStep: number;
}

function Step({ children, step, currentStep }: StepProps) {
  return (
    <div
      className={`${
        step <= currentStep ? "bg-amber-500" : "bg-amber-400"
      } flex mob-lg:flex-col w-full py-4 justify-center items-center mob:justify-start text-center gap-3 border-r px-3 border-amber-600 transition-colors duration-300 ease-out`}
    >
      {children}
    </div>
  );
}

function StepNumber({ children }: PropsWithChildren) {
  return (
    <span className="bg-amber-200 h-8 w-8 rounded-full flex justify-center items-center">
      {children}
    </span>
  );
}
