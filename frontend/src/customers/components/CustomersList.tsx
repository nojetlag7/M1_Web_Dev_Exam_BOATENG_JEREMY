import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

export const CustomersList = () => {
  const {
    customers,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
    page,
    setPage,
    limit,
    totalCount,
  } = useCustomersProvider();

  useEffect(() => {
    load();
  }, [page]);

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton createCustomer={createCustomer} />
      {isLoading ? (
        <Skeleton />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={deleteCustomer}
          />
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
