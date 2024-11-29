import { useRef } from "react";
import { Props as ButtonProps } from "../../../libs/dashlane-style/buttons/modern/base";
import SecondaryButton from "../../../libs/dashlane-style/buttons/modern/secondary";
interface Props extends ButtonProps {
  data: {};
  targetUri: string;
}
export const FormButton = ({ data, targetUri, ...buttonProps }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const getInputs = () => {
    const buffer: JSX.Element[] = [];
    Object.keys(data).forEach((key) =>
      buffer.push(
        <input
          defaultValue={data[key]}
          key={String(Math.random() * 0xffff).replace(/\./, "")}
          type={"hidden"}
          name={key}
        />
      )
    );
    return <div>{buffer}</div>;
  };
  return (
    <form
      action={targetUri}
      method={"post"}
      ref={formRef}
      target="_blank"
      rel="noopener"
    >
      {getInputs()}
      <SecondaryButton
        onClick={() => formRef.current?.submit()}
        {...buttonProps}
      />
    </form>
  );
};
