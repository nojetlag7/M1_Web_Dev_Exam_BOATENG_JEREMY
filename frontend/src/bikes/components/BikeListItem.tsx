import { EyeOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Col, Row, Space } from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { ListItem } from "../../shared/components/ListItem";
import type { BikeModel } from "../models/BikeModel";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeListItemProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });

export const BikeListItem = ({ bike, deleteBike }: BikeListItemProps) => {
  const label = `${bike.brand} ${bike.model}`;

  return (
    <ListItem>
      <Col span={8}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          {label}
          {bike.electric && <ThunderboltOutlined aria-label="Electric" />}
        </Space>
      </Col>
      <Col span={6}>{bike.category}</Col>
      <Col span={4}>{formatPrice(bike.priceCents)}</Col>
      <Col span={6}>
        <Row gutter={[4, 4]} justify="end">
          <Col>
            <ButtonLink to="/bikes/$bikeId" params={{ bikeId: bike.id }}>
              <EyeOutlined />
            </ButtonLink>
          </Col>
          <Col>
            <DeleteBikeButton
              bikeLabel={label}
              onDelete={() => deleteBike(bike.id)}
            />
          </Col>
        </Row>
      </Col>
    </ListItem>
  );
};
