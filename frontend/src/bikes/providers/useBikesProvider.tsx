import axios from "axios";
import { useState } from "react";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

const limit = 10;

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const load = (pageToLoad: number = page) => {
    setIsLoading(true);
    axios
      .get<{ totalCount: number; bikes: BikeModel[] }>(
        "http://localhost:3000/bikes",
        { params: { page: pageToLoad, limit } },
      )
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteBike = (id: string) =>
    axios.delete(`http://localhost:3000/bikes/${id}`).then(() => {
      if (bikes.length === 1 && page > 1) setPage(page - 1);
      else load();
    });

  const createBike = (input: CreateBikeModel) =>
    axios.post<BikeModel>("http://localhost:3000/bikes", input).then(() => {
      load();
    });

  return {
    bikes,
    load,
    isLoading,
    deleteBike,
    createBike,
    page,
    setPage,
    limit,
    totalCount,
  };
};
