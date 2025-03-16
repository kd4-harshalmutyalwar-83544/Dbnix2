import { useEffect, useState, useRef } from "react";

function ProgressBar({ StepsConfig = [] }) {
    const [currentStep, setcurrentStep] = useState(2);
    const [isComplete, setisComplete] = useState(false);
    const [margins, setMargins] = useState({ marginLeft: 0, marginRight: 0 });

    const defaultSteps = [
        { name: "Applied By", Component: () => 
        <div>
            <h6>Doc Name</h6>
            <h6>Date:</h6>

        </div> },
        { name: "Legal Team", Component: () => <div>Approved or Declined</div> },
        { name: "CXO", Component: () => <div>CXO Id</div> },
    ];

    const stepsToRender = StepsConfig.length > 0 ? StepsConfig : defaultSteps;
    const stepRef = useRef([]);

    useEffect(() => {
        if (stepRef.current.length > 0) {
            setMargins({
                marginLeft: stepRef.current[0]?.offsetWidth / 2 || 0,
                marginRight: stepRef.current[stepsToRender.length - 1]?.offsetWidth || 0,
            });
        }
    }, [stepRef, stepsToRender.length]);

    const handleNext = () => {
        setcurrentStep((prevStep) => {
            if (prevStep === stepsToRender.length) {
                setisComplete(true);
                return prevStep;
            }
            return prevStep + 1;
        });
    };

    const calculateProgressBarWidth = () => {
        return ((currentStep - 1) / (stepsToRender.length - 1)) * 100;
    };

    const ActiveComponent = stepsToRender[currentStep - 1]?.Component || (() => <div>No Step Found</div>);

    return (
        <>
            <div className="stepper">
                {stepsToRender.map((step, index) => (
                    <div
                        key={step.name}
                        ref={(el) => (stepRef.current[index] = el)} 
                        className={`step ${currentStep > index + 1 || isComplete ? "Complete" : ""} ${
                            currentStep === index + 1 ? "active" : ""
                        }`}
                    >
                        <div className="step-number">
                            {currentStep > index + 1 || isComplete ? <span>&#10003;</span> : index + 1}
                        </div>
                        <div className="step-name">{step.name}</div>
                        <step.Component />
                    </div>
                ))}

                <div
                    className="progress-bar"
                    style={{
                        width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
                        marginLeft: margins.marginLeft,
                        marginRight: margins.marginRight,
                    }}
                >
                    <div className="progress" style={{ width: `${calculateProgressBarWidth()}%` }}></div>
                </div>
            </div>

            <ActiveComponent />

            {!isComplete && (
                <button className="btn" onClick={handleNext}>
                    {currentStep === stepsToRender.length ? "Finish" : "Next"}
                </button>
            )}
        </>
    );
}

export default ProgressBar;
