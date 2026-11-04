import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  InputNumber,
  Row,
  Skeleton,
  Space,
  Switch,
  Typography,
} from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";

interface BikeInformationCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
  updateBike: (input: UpdateBikeModel) => Promise<void>;
}

type TextField =
  "brand" | "model" | "description" | "category" | "frameMaterial";

type NumberField =
  "frameSizeCm" | "wheelSizeInches" | "gearCount" | "weightKg" | "priceCents";

type BikeFormValues = Record<TextField, string> &
  Record<NumberField, number | null> & { electric: boolean };

type BikeFormErrors = Partial<Record<TextField | NumberField, string>>;

const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });

//manual validation of the form values
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

const toValues = (bike: BikeModel): BikeFormValues => ({
  brand: bike.brand,
  model: bike.model,
  description: bike.description,
  category: bike.category,
  frameMaterial: bike.frameMaterial,
  frameSizeCm: bike.frameSizeCm,
  wheelSizeInches: bike.wheelSizeInches,
  gearCount: bike.gearCount,
  weightKg: bike.weightKg,
  electric: bike.electric,
  priceCents: bike.priceCents,
});

const toUpdate = (
  values: BikeFormValues,
  bike: BikeModel,
): UpdateBikeModel | null => {
  if (
    values.frameSizeCm === null ||
    values.wheelSizeInches === null ||
    values.gearCount === null ||
    values.weightKg === null ||
    values.priceCents === null
  )
    return null;

  const update: UpdateBikeModel = {};
  const brand = values.brand.trim();
  const model = values.model.trim();
  const description = values.description.trim();
  const category = values.category.trim();
  const frameMaterial = values.frameMaterial.trim();
  if (brand !== bike.brand) update.brand = brand;
  if (model !== bike.model) update.model = model;
  if (description !== bike.description) update.description = description;
  if (category !== bike.category) update.category = category;
  if (frameMaterial !== bike.frameMaterial)
    update.frameMaterial = frameMaterial;
  if (values.frameSizeCm !== bike.frameSizeCm)
    update.frameSizeCm = values.frameSizeCm;
  if (values.wheelSizeInches !== bike.wheelSizeInches)
    update.wheelSizeInches = values.wheelSizeInches;
  if (values.gearCount !== bike.gearCount) update.gearCount = values.gearCount;
  if (values.weightKg !== bike.weightKg) update.weightKg = values.weightKg;
  if (values.electric !== bike.electric) update.electric = values.electric;
  if (values.priceCents !== bike.priceCents)
    update.priceCents = values.priceCents;
  if (Object.keys(update).length === 0) return null;
  return update;
};

export const BikeInformationCard = ({
  bike,
  isLoading,
  updateBike,
}: BikeInformationCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues | null>(null);
  const [errors, setErrors] = useState<BikeFormErrors>({});

  const startEditing = () => {
    if (!bike) return;
    setValues(toValues(bike));
    setErrors({});
    setIsEditing(true);
  };

  const cancel = () => {
    setValues(null);
    setErrors({});
    setIsEditing(false);
  };

  const save = () => {
    if (!values || !bike) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    const update = toUpdate(values, bike);
    if (!update) {
      cancel();
      return;
    }

    setIsSaving(true);
    updateBike(update)
      .then(cancel)
      .catch(() => {})
      .finally(() => setIsSaving(false));
  };

  const shown = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    { key: "brand", label: "Brand", children: shown(bike?.brand) },
    { key: "model", label: "Model", children: shown(bike?.model) },
    {
      key: "description",
      label: "Description",
      children: shown(bike?.description),
    },
    { key: "category", label: "Category", children: shown(bike?.category) },
    {
      key: "frameMaterial",
      label: "Frame material",
      children: shown(bike?.frameMaterial),
    },
    {
      key: "frameSizeCm",
      label: "Frame size",
      children: shown(bike && `${bike.frameSizeCm} cm`),
    },
    {
      key: "wheelSizeInches",
      label: "Wheel size",
      children: shown(bike && `${bike.wheelSizeInches} in`),
    },
    { key: "gearCount", label: "Gears", children: shown(bike?.gearCount) },
    {
      key: "weightKg",
      label: "Weight",
      children: shown(bike && `${bike.weightKg} kg`),
    },
    {
      key: "electric",
      label: "Electric",
      children: shown(bike ? (bike.electric ? "Yes" : "No") : null),
    },
    {
      key: "priceCents",
      label: "Price",
      children: shown(bike && formatPrice(bike.priceCents)),
    },
  ];

  const textField = (name: TextField, label: string) =>
    values && (
      <>
        <label htmlFor={`bike-edit-${name}`}>{label}</label>
        <Input
          id={`bike-edit-${name}`}
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

  const numberField = (name: NumberField, label: string, precision?: number) =>
    values && (
      <>
        <label htmlFor={`bike-edit-${name}`}>{label}</label>
        <InputNumber
          id={`bike-edit-${name}`}
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
    <Card
      title="Bicycle"
      style={{ width: "100%" }}
      extra={
        isEditing ? (
          <Space>
            <Button icon={<CloseOutlined />} onClick={cancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSaving}
              onClick={save}
            >
              Save
            </Button>
          </Space>
        ) : (
          <Button
            icon={<EditOutlined />}
            aria-label="Edit bicycle"
            disabled={!bike}
            onClick={startEditing}
          />
        )
      }
    >
      {isEditing && values ? (
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
            <label htmlFor="bike-edit-electric">Electric</label>
            <div>
              <Switch
                id="bike-edit-electric"
                checked={values.electric}
                onChange={(checked) =>
                  setValues({ ...values, electric: checked })
                }
              />
            </div>
          </Col>
        </Row>
      ) : (
        <Descriptions column={1} items={items} />
      )}
    </Card>
  );
};
