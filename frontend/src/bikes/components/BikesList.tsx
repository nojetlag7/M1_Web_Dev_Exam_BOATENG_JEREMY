import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import { useBikesProvider } from "../providers/useBikesProvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

export const BikesList = () => {
  const {
    bikes,
    deleteBike,
    createBike,
    isLoading,
    load,
    page,
    setPage,
    limit,
    totalCount,
  } = useBikesProvider();

  useEffect(() => {
    load();
  }, [page]);

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddBikeButton createBike={createBike} />
      {isLoading ? (
        <Skeleton />
      ) : (
        bikes.map((bike) => (
          <BikeListItem key={bike.id} bike={bike} deleteBike={deleteBike} />
        ))
      )}
      <Pagination
        current={page}
        pageSize={limit}
        total={totalCount}
        onChange={(newPage) => setPage(newPage)}
        showSizeChanger={false}
      />
    </Space>
  );
};
