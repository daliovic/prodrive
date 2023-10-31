import { FC } from "react";
import "./InputField.css";

interface Props {
  placeholder: string;
  type: string;
  icon?: string;
  style?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined | any;
}

const InputField: FC<Props> = ({
  placeholder,
  type,
  icon,
  style,
  onChange,
}) => {
  const onChangeField = (e: any) => {
    onChange(e.target.value);
  };
  return (
    <div className="input-container">
      <input
        onChange={(e) => {
          onChangeField(e);
        }}
        style={style}
        type={type}
        placeholder={placeholder}
      />
      <i className={`pi pi-${icon}`}></i>
    </div>
  );
};
export default InputField;
