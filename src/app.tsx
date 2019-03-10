import { h, Component, FunctionalComponent } from 'preact';
import { SceneDef, SceneStepDef, StepComponentProps } from './interface';
import { StepNotice, StepFocus, StepCarousel } from './component/step';
import { withAllStepHelper } from './component/step/hoc';
import { normalDebug } from './debug';
import { ThemeContext } from './component/provider/theme';
import { StepInputChecker } from './component/step/input-checker';

const stepComponentMap: { [type in keyof SceneStepDef]: any } = {
  base: null,
  notice: StepNotice,
  focus: StepFocus,
  carousel: StepCarousel,
  inputChecker: StepInputChecker,
};

function getStepComponent(
  type: keyof SceneStepDef
): FunctionalComponent<StepComponentProps['base']> {
  const Comp = stepComponentMap[type];

  if (!Comp) return;

  return withAllStepHelper(Comp) as any;
}

const CANCEL_FLAG = -1;

export interface Props {
  sceneData: SceneDef;

  onNextStep?: (index: number) => void;
  onFinish?: () => void;
}

export interface State {
  stepIndex?: number;
}

export class App extends Component<Props, State> {
  state: State = {
    stepIndex: 0,
  };

  gotoNext() {
    const stepIndex = this.state.stepIndex + 1;
    this.setState({ stepIndex });

    this.props.onNextStep && this.props.onNextStep(stepIndex);

    normalDebug.log('gotoNext: stepIndex=%s', stepIndex);

    if (stepIndex >= this.props.sceneData.steps.length) {
      this.props.onFinish && this.props.onFinish();
      normalDebug.log('scene is finish');
    }
  }

  cancel() {
    const stepIndex = CANCEL_FLAG;
    this.setState({ stepIndex });
  }

  handleNext = () => {
    this.gotoNext();
  };

  handleCancel = () => {
    this.cancel();
  };

  render() {
    const { sceneData } = this.props;
    const { stepIndex } = this.state;

    const currentStep = sceneData.steps[stepIndex];

    if (!currentStep) {
      normalDebug.info('currentStep is null');
      return null;
    }

    normalDebug.info('currentStep: type=%s, index=%s', currentStep.type, stepIndex);

    const StepComp = getStepComponent(currentStep.type);

    return (
      <ThemeContext.Provider value={sceneData.theme}>
        {StepComp && (
          <StepComp
            // 赋予不同的 key，保证每个 Step 都是新的（生命周期里有副作用）
            key={stepIndex}
            data={currentStep as any}
            stepIndex={stepIndex}
            stepTotal={sceneData.steps.length}
            onNext={this.handleNext}
            onCancel={this.handleCancel}
          />
        )}
      </ThemeContext.Provider>
    );
  }
}
