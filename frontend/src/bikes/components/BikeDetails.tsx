import { ArrowLeftOutlined, ToolOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton, Space } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect } from "react";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import { BikeInformationCard } from "./BikeInformationCard";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const navigate = useNavigate();
  const { bike, isLoading, load, updateBike, deleteBike } =
    useBikeDetailsProvider(bikeId);

  useEffect(() => {
    load();
  }, [bikeId]);

  const label = bike ? `${bike.brand} ${bike.model}` : "Bike";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center">
        <ToolOutlined style={{ fontSize: "1.5rem" }} />
        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Title level={2} style={{ margin: 0 }}>
            {bike ? label : "Bike not found"}
          </Title>
        )}
        {bike && (
          <DeleteBikeButton
            bikeLabel={label}
            onDelete={() =>
              deleteBike().then(() => {
                navigate({ to: "/bikes" });
              })
            }
          />
        )}
      </Space>

      <BikeInformationCard
        bike={bike}
        isLoading={isLoading}
        updateBike={updateBike}
      />
    </div>
  );
};
