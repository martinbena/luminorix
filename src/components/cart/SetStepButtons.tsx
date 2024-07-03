import Button from "../ui/Button";
import Form from "../ui/Form";

interface SetStepButtonsProps {
  onStepDecrement: () => void;
  onStepIncrement?: () => void;
  currentStep: number;
}

export default function SetStepButtons({
  onStepDecrement,
  onStepIncrement,
  currentStep,
}: SetStepButtonsProps) {
  return (
    <div
      className={`flex justify-between items-center ${
        currentStep === 3 ? "" : "mt-6"
      }`}
    >
      {currentStep > 1 ? (
        <Button type="tertiary" onClick={() => onStepDecrement()}>
          Previous step
        </Button>
      ) : (
        <span>&nbsp;</span>
      )}

      {onStepIncrement ? (
        <Button type="secondary" onClick={() => onStepIncrement()}>
          Next step
        </Button>
      ) : (
        <div className="max-w-40 w-full">
          <Form.Button>Place order</Form.Button>
        </div>
      )}
    </div>
  );
}
