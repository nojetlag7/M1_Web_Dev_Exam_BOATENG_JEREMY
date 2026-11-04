import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
} from "../models/CustomerModel";


const limit = 10;

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const load = (pageToLoad: number = page) => {
    setIsLoading(true);
    axios
      .get<{ totalCount: number; customers: CustomerModel[] }>(
        "http://localhost:3000/customers",
        { params: { page: pageToLoad, limit } },
      )
      .then((result) => {
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCustomer = (id: string) => {
    axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
      // The page we just emptied is gone; the effect on `page` reloads the previous one.
      if (customers.length === 1 && page > 1) setPage(page - 1);
      else load();
    });
  };

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then(() => {
        load();
      });

  return {
    customers,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
    page,
    setPage,
    limit,
    totalCount,
  };
};
