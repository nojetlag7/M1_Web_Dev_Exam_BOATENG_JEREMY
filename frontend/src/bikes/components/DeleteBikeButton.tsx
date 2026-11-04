import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";

interface DeleteBikeButtonProps {
  bikeLabel: string;
  onDelete: () => Promise<void>;
}

export const DeleteBikeButton = ({
  bikeLabel,
  onDelete,
}: DeleteBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onCancel = () => {
    setErrorMessage("");
    setIsOpen(false);
  };

  const onConfirm = () => {
    setIsDeleting(true);
    setErrorMessage("");
    onDelete()
      .then(() => setIsOpen(false))
      .catch((error: unknown) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          setErrorMessage("This bike cannot be deleted because it has sales");
        }
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <Button danger onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
      </Button>
      <Modal
        okButtonProps={{ danger: true }}
        confirmLoading={isDeleting}
        open={isOpen}
        title={`Deleting ${bikeLabel}`}
        onCancel={onCancel}
        onOk={onConfirm}
        okText="Yes, delete"
      >
        You are about to delete the bike {bikeLabel}. This action cannot be
        undone, are you sure?
        {errorMessage && (
          <div>
            <Typography.Text type="danger">{errorMessage}</Typography.Text>
          </div>
        )}
      </Modal>
    </>
  );
};
