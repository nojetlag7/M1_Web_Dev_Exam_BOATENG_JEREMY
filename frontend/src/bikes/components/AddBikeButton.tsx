import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Switch,
  Typography,
} from "antd";
import { useState } from "react";
import type { CreateBikeModel } from "../models/BikeModel";

interface AddBikeButtonProps {
  createBike: (input: CreateBikeModel) => Promise<void>;
}

type TextField =
  "brand" | "model" | "description" | "category" | "frameMaterial";

type NumberField =
  "frameSizeCm" | "wheelSizeInches" | "gearCount" | "weightKg" | "priceCents";

type BikeFormValues = Record<TextField, string> &
  Record<NumberField, number | null> & { electric: boolean };

type BikeFormErrors = Partial<Record<TextField | NumberField, string>>;

const emptyValues: BikeFormValues = {
  brand: "",
  model: "",
  description: "",
  category: "",
  frameMaterial: "",
  frameSizeCm: null,
  wheelSizeInches: null,
  gearCount: null,
  weightKg: null,
  electric: false,
  priceCents: null,
};

const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.description.trim())
    errors.description = "Description is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.frameMaterial.trim())
    errors.frameMaterial = "Frame material is required";
  if (values.frameSizeCm === null || !(values.frameSizeCm > 0))
    errors.frameSizeCm = "Frame size must be greater than 0";
  if (values.wheelSizeInches === null || !(values.wheelSizeInches > 0))
    errors.wheelSizeInches = "Wheel size must be greater than 0";
  if (values.weightKg === null || !(values.weightKg > 0))
    errors.weightKg = "Weight must be greater than 0";
  if (
    values.gearCount === null ||
    !Number.isInteger(values.gearCount) ||
    values.gearCount < 1
  )
    errors.gearCount = "Gear count must be a positive integer";
  if (
    values.priceCents === null ||
    !Number.isInteger(values.priceCents) ||
    values.priceCents < 0
  )
    errors.priceCents = "Price must be a whole number of cents";
  return errors;
};

const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel | null => {
  if (
    values.frameSizeCm === null ||
    values.wheelSizeInches === null ||
    values.gearCount === null ||
    values.weightKg === null ||
    values.priceCents === null
  )
    return null;
  return {
    brand: values.brand.trim(),
    model: values.model.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    frameMaterial: values.frameMaterial.trim(),
    frameSizeCm: values.frameSizeCm,
    wheelSizeInches: values.wheelSizeInches,
    gearCount: values.gearCount,
    weightKg: values.weightKg,
    electric: values.electric,
    priceCents: values.priceCents,
  };
};

export const AddBikeButton = ({ createBike }: AddBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(emptyValues);
  const [errors, setErrors] = useState<BikeFormErrors>({});

  const close = () => {
    setValues(emptyValues);
    setErrors({});
    setIsOpen(false);
  };

  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    const input = toCreateBikeModel(values);
    if (!input) return;

    setIsSaving(true);
    createBike(input)
      .then(close)
      .finally(() => setIsSaving(false));
  };

  const textField = (name: TextField, label: string) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <Input
        id={`bike-${name}`}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(event) => {
          setValues({ ...values, [name]: event.target.value });
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {errors[name] && (
        <Typography.Text type="danger">{errors[name]}</Typography.Text>
      )}
    </>
  );

  const numberField = (
    name: NumberField,
    label: string,
    precision?: number,
  ) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <InputNumber
        id={`bike-${name}`}
        style={{ width: "100%" }}
        min={0}
        precision={precision}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(value) => {
          setValues({
            ...values,
            [name]: typeof value === "number" ? value : null,
          });
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {errors[name] && (
        <Typography.Text type="danger">{errors[name]}</Typography.Text>
      )}
    </>
  );

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Add bike
      </Button>
      <Modal
        open={isOpen}
        title="New bike"
        okText="Add bike"
        onCancel={close}
        onOk={onConfirm}
        confirmLoading={isSaving}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>{textField("brand", "Brand *")}</Col>
          <Col span={12}>{textField("model", "Model *")}</Col>
          <Col span={24}>{textField("description", "Description *")}</Col>
          <Col span={12}>{textField("category", "Category *")}</Col>
          <Col span={12}>{textField("frameMaterial", "Frame material *")}</Col>
          <Col span={8}>{numberField("frameSizeCm", "Frame size (cm) *")}</Col>
          <Col span={8}>
            {numberField("wheelSizeInches", "Wheel size (in) *")}
          </Col>
          <Col span={8}>{numberField("gearCount", "Gears *", 0)}</Col>
          <Col span={8}>{numberField("weightKg", "Weight (kg) *")}</Col>
          <Col span={8}>{numberField("priceCents", "Price (cents) *", 0)}</Col>
          <Col span={8}>
            <label htmlFor="bike-electric">Electric</label>
            <div>
              <Switch
                id="bike-electric"
                checked={values.electric}
                onChange={(checked) =>
                  setValues({ ...values, electric: checked })
                }
              />
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
